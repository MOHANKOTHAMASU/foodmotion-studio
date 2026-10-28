-- FoodMotion Studio: core schema
-- Conventions: all money in integer minor units (paise), timestamps are timestamptz,
-- every table has RLS enabled in 20261028000002_rls_policies.sql.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------- enums ----------
create type public.app_role as enum ('customer', 'business_owner', 'creator', 'admin');
create type public.business_type as enum (
  'restaurant', 'cafe', 'bakery', 'cloud_kitchen', 'catering', 'street_food', 'dessert', 'home_chef', 'other'
);
create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type public.member_role as enum ('owner', 'manager', 'staff');
create type public.project_status as enum ('draft', 'published', 'archived');
create type public.export_status as enum ('queued', 'rendering', 'completed', 'failed', 'cancelled');
create type public.export_format as enum ('gif', 'png_sequence', 'webm', 'mp4', 'png');
create type public.inquiry_status as enum ('new', 'read', 'replied', 'closed');
create type public.order_status as enum (
  'cart', 'placed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'rejected'
);
create type public.payment_status as enum ('created', 'authorized', 'captured', 'failed', 'refunded');
create type public.payment_mode as enum ('sandbox', 'live');
create type public.subscription_status as enum ('active', 'trialing', 'past_due', 'cancelled', 'expired');
create type public.plan_code as enum ('free_starter', 'creator', 'business_pro', 'enterprise');
create type public.report_status as enum ('open', 'reviewing', 'actioned', 'dismissed');
create type public.diet_label as enum ('veg', 'non_veg', 'egg', 'vegan', 'jain');

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique,
  full_name text not null default '',
  avatar_url text,
  bio text,
  phone text,
  city text,
  website text,
  onboarding_completed boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-z0-9_]{3,30}$'),
  constraint bio_length check (bio is null or char_length(bio) <= 600)
);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
create index user_roles_role_idx on public.user_roles(role);

-- Security-definer helpers (stable, used in policies). They read user_roles
-- without triggering RLS recursion.
create or replace function public.has_role(target_role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role = target_role);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('admin');
$$;

-- Create a profile + default customer role for each new auth user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'requested_role', 'customer');
  safe_role public.app_role := 'customer';
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;

  -- admin can never be self-requested during signup
  if requested_role in ('business_owner', 'creator') then
    safe_role := requested_role::public.app_role;
  end if;

  insert into public.user_roles (user_id, role) values (new.id, 'customer') on conflict do nothing;
  if safe_role <> 'customer' then
    insert into public.user_roles (user_id, role) values (new.id, safe_role) on conflict do nothing;
  end if;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ---------- categories ----------
create table public.food_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  emoji text,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- businesses ----------
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null,
  name text not null,
  type public.business_type not null default 'restaurant',
  tagline text,
  description text,
  cuisines text[] not null default '{}',
  logo_url text,
  cover_url text,
  phone text,
  email citext,
  website text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text not null default 'IN',
  latitude double precision,
  longitude double precision,
  opening_hours jsonb not null default '{}'::jsonb,
  price_level smallint check (price_level between 1 and 4),
  accepts_orders boolean not null default false,
  upi_id text,
  is_published boolean not null default false,
  verification_status public.verification_status not null default 'unverified',
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_slug_format check (slug ~ '^[a-z0-9-]{3,60}$'),
  constraint business_name_length check (char_length(name) between 2 and 80)
);
create index businesses_owner_idx on public.businesses(owner_id);
create index businesses_city_idx on public.businesses(lower(city));
create index businesses_published_idx on public.businesses(is_published) where is_published;
create index businesses_cuisines_idx on public.businesses using gin(cuisines);
create trigger businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();

create table public.business_members (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'staff',
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_members_user_idx on public.business_members(user_id);

create or replace function public.is_business_member(target_business uuid, min_role public.member_role default 'staff')
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.businesses b where b.id = target_business and b.owner_id = auth.uid()
  ) or exists (
    select 1 from public.business_members m
    where m.business_id = target_business and m.user_id = auth.uid()
      and (
        min_role = 'staff'
        or (min_role = 'manager' and m.role in ('owner', 'manager'))
        or (min_role = 'owner' and m.role = 'owner')
      )
  );
$$;

create table public.business_verification_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  legal_name text not null,
  registration_number text,
  fssai_license text,
  gstin text,
  document_urls text[] not null default '{}',
  notes text,
  status public.verification_status not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now()
);
create index bvr_business_idx on public.business_verification_requests(business_id);
create index bvr_status_idx on public.business_verification_requests(status);

-- ---------- menu ----------
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.food_categories(id) on delete set null,
  name text not null,
  description text,
  price_minor int not null check (price_minor >= 0),
  currency char(3) not null default 'INR',
  image_url text,
  diet public.diet_label,
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  prep_time_minutes int check (prep_time_minutes between 0 and 600),
  spice_level smallint check (spice_level between 0 and 3),
  customization_options jsonb not null default '[]'::jsonb,
  promo_animation_id uuid,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_item_name_length check (char_length(name) between 1 and 80)
);
create index menu_items_business_idx on public.menu_items(business_id);
create index menu_items_category_idx on public.menu_items(category_id);
create trigger menu_items_updated_at before update on public.menu_items for each row execute function public.set_updated_at();

-- ---------- animation studio ----------
create table public.animation_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  title text not null default 'Untitled project',
  description text,
  template_slug text,
  category_slug text,
  aspect_ratio text not null default '16:9' check (aspect_ratio in ('16:9', '9:16', '1:1', '4:5')),
  width int not null default 1280 check (width between 240 and 3840),
  height int not null default 720 check (height between 240 and 3840),
  fps smallint not null default 30 check (fps in (12, 15, 24, 30)),
  status public.project_status not null default 'draft',
  thumbnail_url text,
  document jsonb not null default '{"version":1,"scenes":[]}'::jsonb,
  document_version int not null default 1,
  last_opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_title_length check (char_length(title) between 1 and 100)
);
create index animation_projects_owner_idx on public.animation_projects(owner_id, updated_at desc);
create index animation_projects_business_idx on public.animation_projects(business_id);
create trigger animation_projects_updated_at before update on public.animation_projects for each row execute function public.set_updated_at();

-- Normalised scene index (the editable document lives in animation_projects.document;
-- this table is kept in sync by the save action for querying/ordering/analytics).
create table public.animation_scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.animation_projects(id) on delete cascade,
  scene_key text not null,
  name text not null,
  sort_order int not null default 0,
  duration_ms int not null default 3000 check (duration_ms between 200 and 60000),
  transition text not null default 'cut',
  layer_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (project_id, scene_key)
);
create index animation_scenes_project_idx on public.animation_scenes(project_id, sort_order);

create table public.animation_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.animation_projects(id) on delete set null,
  kind text not null check (kind in ('image', 'model', 'audio', 'font')),
  bucket text not null,
  storage_path text not null,
  public_url text,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 15728640),
  width int,
  height int,
  created_at timestamptz not null default now(),
  unique (bucket, storage_path)
);
create index animation_assets_owner_idx on public.animation_assets(owner_id);

create table public.animation_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.animation_projects(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete cascade,
  format public.export_format not null,
  width int not null,
  height int not null,
  fps smallint not null,
  frame_count int,
  status public.export_status not null default 'queued',
  progress smallint not null default 0 check (progress between 0 and 100),
  renderer text not null default 'browser',
  bucket text,
  storage_path text,
  size_bytes bigint,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index animation_exports_project_idx on public.animation_exports(project_id, created_at desc);
create index animation_exports_user_idx on public.animation_exports(requested_by, created_at desc);

create table public.published_animations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.animation_projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  slug text unique not null,
  title text not null,
  description text,
  category_slug text,
  thumbnail_url text,
  document jsonb not null,
  width int not null,
  height int not null,
  fps smallint not null,
  view_count int not null default 0,
  like_count int not null default 0,
  is_featured boolean not null default false,
  is_hidden boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index published_animations_owner_idx on public.published_animations(owner_id);
create index published_animations_category_idx on public.published_animations(category_slug) where not is_hidden;
create index published_animations_featured_idx on public.published_animations(is_featured, published_at desc) where not is_hidden;
create trigger published_animations_updated_at before update on public.published_animations for each row execute function public.set_updated_at();

alter table public.menu_items
  add constraint menu_items_promo_fk foreign key (promo_animation_id) references public.published_animations(id) on delete set null;

-- ---------- customer features ----------
create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('business', 'animation', 'menu_item', 'creator')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  name text not null,
  email citext not null,
  phone text,
  subject text not null,
  message text not null check (char_length(message) between 10 and 2000),
  event_date date,
  guest_count int check (guest_count between 1 and 5000),
  status public.inquiry_status not null default 'new',
  reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);
create index inquiries_business_idx on public.inquiries(business_id, created_at desc);
create index inquiries_customer_idx on public.inquiries(customer_id);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses(user_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete restrict,
  customer_id uuid not null references auth.users(id) on delete restrict,
  status public.order_status not null default 'cart',
  fulfilment text not null default 'pickup' check (fulfilment in ('pickup', 'delivery', 'dine_in')),
  subtotal_minor int not null default 0 check (subtotal_minor >= 0),
  tax_minor int not null default 0 check (tax_minor >= 0),
  delivery_fee_minor int not null default 0 check (delivery_fee_minor >= 0),
  total_minor int not null default 0 check (total_minor >= 0),
  currency char(3) not null default 'INR',
  address_snapshot jsonb,
  notes text,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_business_idx on public.orders(business_id, created_at desc);
create index orders_customer_idx on public.orders(customer_id, created_at desc);
create unique index orders_one_cart_per_business on public.orders(customer_id, business_id) where status = 'cart';
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name_snapshot text not null,
  unit_price_minor int not null check (unit_price_minor >= 0),
  quantity int not null check (quantity between 1 and 50),
  customizations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index order_items_order_idx on public.order_items(order_id);

-- ---------- payments & subscriptions ----------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  plan public.plan_code not null default 'free_starter',
  status public.subscription_status not null default 'active',
  mode public.payment_mode not null default 'sandbox',
  provider text,
  provider_subscription_id text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscription_scope check (user_id is not null or business_id is not null)
);
create unique index subscriptions_user_unique on public.subscriptions(user_id) where user_id is not null and status in ('active', 'trialing', 'past_due');
create index subscriptions_business_idx on public.subscriptions(business_id);
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'razorpay',
  mode public.payment_mode not null default 'sandbox',
  provider_order_id text,
  provider_payment_id text unique,
  idempotency_key text unique,
  amount_minor int not null check (amount_minor >= 0),
  currency char(3) not null default 'INR',
  status public.payment_status not null default 'created',
  method text,
  failure_reason text,
  raw_event jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_user_idx on public.payments(user_id, created_at desc);
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

-- ---------- reviews & moderation ----------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text check (body is null or char_length(body) <= 2000),
  is_verified_purchase boolean not null default false,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, author_id, order_id)
);
create index reviews_business_idx on public.reviews(business_id, created_at desc);
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('business', 'animation', 'review', 'profile', 'menu_item')),
  target_id uuid not null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default now()
);
create index moderation_reports_status_idx on public.moderation_reports(status, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);
create index audit_logs_action_idx on public.audit_logs(action, created_at desc);

create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.animation_templates (
  slug text primary key,
  name text not null,
  category_slug text,
  description text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- rate limiting (simple, DB-backed; used by server actions) ----------
create table public.rate_limits (
  bucket text not null,
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (bucket, key, window_start)
);

create or replace function public.consume_rate_limit(p_bucket text, p_key text, p_limit int, p_window_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  c int;
begin
  insert into public.rate_limits (bucket, key, window_start, count)
  values (p_bucket, p_key, w, 1)
  on conflict (bucket, key, window_start) do update set count = public.rate_limits.count + 1
  returning count into c;
  delete from public.rate_limits where window_start < now() - interval '1 day';
  return c <= p_limit;
end $$;

-- ---------- audit helper ----------
create or replace function public.log_audit(p_action text, p_target_type text, p_target_id text, p_metadata jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = public as $$
  insert into public.audit_logs (actor_id, action, target_type, target_id, metadata)
  values (auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb));
$$;

-- ---------- published animation view counter ----------
create or replace function public.increment_animation_view(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.published_animations set view_count = view_count + 1 where slug = p_slug and not is_hidden;
$$;

-- ---------- review aggregates ----------
create or replace function public.refresh_business_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare bid uuid := coalesce(new.business_id, old.business_id);
begin
  update public.businesses b set
    rating_avg = coalesce((select round(avg(rating)::numeric, 2) from public.reviews r where r.business_id = bid and not r.is_hidden), 0),
    rating_count = (select count(*) from public.reviews r where r.business_id = bid and not r.is_hidden)
  where b.id = bid;
  return null;
end $$;
create trigger reviews_refresh_rating after insert or update or delete on public.reviews
  for each row execute function public.refresh_business_rating();

-- ---------- limit guards ----------
create or replace function public.enforce_project_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  n int;
  max_projects int := 10;
  p public.plan_code;
begin
  select plan into p from public.subscriptions s where s.user_id = new.owner_id and s.status in ('active', 'trialing') limit 1;
  max_projects := case p when 'creator' then 50 when 'business_pro' then 200 when 'enterprise' then 10000 else 10 end;
  select count(*) into n from public.animation_projects where owner_id = new.owner_id and status <> 'archived';
  if n >= max_projects then
    raise exception 'PROJECT_LIMIT_REACHED: your plan allows % projects', max_projects using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger animation_projects_limit before insert on public.animation_projects
  for each row execute function public.enforce_project_limit();

create or replace function public.enforce_export_concurrency()
returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from public.animation_exports
  where requested_by = new.requested_by and status in ('queued', 'rendering');
  if n >= 3 then
    raise exception 'EXPORT_LIMIT_REACHED: wait for running exports to finish' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger animation_exports_concurrency before insert on public.animation_exports
  for each row execute function public.enforce_export_concurrency();
