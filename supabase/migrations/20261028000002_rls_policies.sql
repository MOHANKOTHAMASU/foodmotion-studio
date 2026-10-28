-- Row Level Security for every table. Default deny; policies grant the minimum.

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.food_categories enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.business_verification_requests enable row level security;
alter table public.menu_items enable row level security;
alter table public.animation_projects enable row level security;
alter table public.animation_scenes enable row level security;
alter table public.animation_assets enable row level security;
alter table public.animation_exports enable row level security;
alter table public.published_animations enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiries enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.moderation_reports enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;
alter table public.animation_templates enable row level security;
alter table public.rate_limits enable row level security;

-- profiles
create policy "profiles: public read of public profiles" on public.profiles
  for select using (is_public or id = auth.uid() or public.is_admin());
create policy "profiles: owner update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- user_roles: users see their own roles; only admins manage roles
create policy "user_roles: self read" on public.user_roles for select using (user_id = auth.uid() or public.is_admin());
create policy "user_roles: admin insert" on public.user_roles for insert with check (public.is_admin());
create policy "user_roles: admin delete" on public.user_roles for delete using (public.is_admin());

-- food_categories: public read, admin write
create policy "categories: public read" on public.food_categories for select using (true);
create policy "categories: admin write" on public.food_categories for all using (public.is_admin()) with check (public.is_admin());

-- animation_templates
create policy "templates: public read" on public.animation_templates for select using (is_active or public.is_admin());
create policy "templates: admin write" on public.animation_templates for all using (public.is_admin()) with check (public.is_admin());

-- businesses
create policy "businesses: public read published" on public.businesses
  for select using (is_published or owner_id = auth.uid() or public.is_business_member(id) or public.is_admin());
create policy "businesses: owner insert" on public.businesses
  for insert with check (owner_id = auth.uid() and (public.has_role('business_owner') or public.is_admin()));
create policy "businesses: member update" on public.businesses
  for update using (public.is_business_member(id, 'manager') or public.is_admin())
  with check (public.is_business_member(id, 'manager') or public.is_admin());
create policy "businesses: owner delete" on public.businesses
  for delete using (owner_id = auth.uid() or public.is_admin());

-- business_members
create policy "members: visible to business" on public.business_members
  for select using (user_id = auth.uid() or public.is_business_member(business_id) or public.is_admin());
create policy "members: owner manage" on public.business_members
  for all using (public.is_business_member(business_id, 'owner') or public.is_admin())
  with check (public.is_business_member(business_id, 'owner') or public.is_admin());

-- verification requests
create policy "bvr: business read" on public.business_verification_requests
  for select using (public.is_business_member(business_id, 'manager') or public.is_admin());
create policy "bvr: business insert" on public.business_verification_requests
  for insert with check (submitted_by = auth.uid() and public.is_business_member(business_id, 'manager'));
create policy "bvr: admin update" on public.business_verification_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- menu_items
create policy "menu: public read for published businesses" on public.menu_items
  for select using (
    exists (select 1 from public.businesses b where b.id = business_id and b.is_published)
    or public.is_business_member(business_id) or public.is_admin()
  );
create policy "menu: member write" on public.menu_items
  for all using (public.is_business_member(business_id) or public.is_admin())
  with check (public.is_business_member(business_id) or public.is_admin());

-- animation_projects
create policy "projects: owner read" on public.animation_projects
  for select using (owner_id = auth.uid() or (business_id is not null and public.is_business_member(business_id)) or public.is_admin());
create policy "projects: owner insert" on public.animation_projects
  for insert with check (owner_id = auth.uid());
create policy "projects: owner update" on public.animation_projects
  for update using (owner_id = auth.uid() or (business_id is not null and public.is_business_member(business_id, 'manager')) or public.is_admin())
  with check (owner_id = auth.uid() or (business_id is not null and public.is_business_member(business_id, 'manager')) or public.is_admin());
create policy "projects: owner delete" on public.animation_projects
  for delete using (owner_id = auth.uid() or public.is_admin());

-- animation_scenes (follow the project)
create policy "scenes: via project" on public.animation_scenes
  for all using (exists (select 1 from public.animation_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.animation_projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

-- animation_assets
create policy "assets: owner" on public.animation_assets
  for all using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid());

-- animation_exports
create policy "exports: owner read" on public.animation_exports
  for select using (requested_by = auth.uid() or public.is_admin());
create policy "exports: owner insert" on public.animation_exports
  for insert with check (
    requested_by = auth.uid()
    and exists (select 1 from public.animation_projects p where p.id = project_id and p.owner_id = auth.uid())
  );
create policy "exports: owner update" on public.animation_exports
  for update using (requested_by = auth.uid() or public.is_admin()) with check (requested_by = auth.uid() or public.is_admin());

-- published_animations
create policy "published: public read" on public.published_animations
  for select using (not is_hidden or owner_id = auth.uid() or public.is_admin());
create policy "published: owner insert" on public.published_animations
  for insert with check (
    owner_id = auth.uid()
    and exists (select 1 from public.animation_projects p where p.id = project_id and p.owner_id = auth.uid())
  );
create policy "published: owner update" on public.published_animations
  for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
create policy "published: owner delete" on public.published_animations
  for delete using (owner_id = auth.uid() or public.is_admin());

-- favorites
create policy "favorites: owner" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- inquiries: anyone (incl. anon) can create for a published business; business reads/updates; customer reads own
create policy "inquiries: create for published business" on public.inquiries
  for insert with check (
    exists (select 1 from public.businesses b where b.id = business_id and b.is_published)
    and (customer_id is null or customer_id = auth.uid())
  );
create policy "inquiries: read" on public.inquiries
  for select using (customer_id = auth.uid() or public.is_business_member(business_id) or public.is_admin());
create policy "inquiries: business update" on public.inquiries
  for update using (public.is_business_member(business_id) or public.is_admin())
  with check (public.is_business_member(business_id) or public.is_admin());

-- addresses
create policy "addresses: owner" on public.addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- orders
create policy "orders: customer read" on public.orders
  for select using (customer_id = auth.uid() or public.is_business_member(business_id) or public.is_admin());
create policy "orders: customer create cart" on public.orders
  for insert with check (
    customer_id = auth.uid() and status = 'cart'
    and exists (select 1 from public.businesses b where b.id = business_id and b.is_published and b.accepts_orders)
  );
create policy "orders: customer update own cart" on public.orders
  for update using (customer_id = auth.uid() and status in ('cart', 'placed'))
  with check (customer_id = auth.uid());
create policy "orders: business update status" on public.orders
  for update using (public.is_business_member(business_id) or public.is_admin())
  with check (public.is_business_member(business_id) or public.is_admin());
create policy "orders: customer delete cart" on public.orders
  for delete using (customer_id = auth.uid() and status = 'cart');

-- order_items
create policy "order_items: via order" on public.order_items
  for select using (exists (
    select 1 from public.orders o where o.id = order_id
      and (o.customer_id = auth.uid() or public.is_business_member(o.business_id) or public.is_admin())
  ));
create policy "order_items: customer edits cart" on public.order_items
  for all using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid() and o.status = 'cart'))
  with check (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid() and o.status = 'cart'));

-- subscriptions & payments: readable by owner, written only by server (service role) or admin
create policy "subscriptions: owner read" on public.subscriptions
  for select using (user_id = auth.uid() or (business_id is not null and public.is_business_member(business_id, 'manager')) or public.is_admin());
create policy "subscriptions: admin write" on public.subscriptions
  for all using (public.is_admin()) with check (public.is_admin());
create policy "payments: owner read" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());
create policy "payments: admin write" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- reviews: only after a delivered order with that business
create policy "reviews: public read" on public.reviews for select using (not is_hidden or author_id = auth.uid() or public.is_admin());
create policy "reviews: verified customer insert" on public.reviews
  for insert with check (
    author_id = auth.uid()
    and exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid() and o.business_id = business_id and o.status = 'delivered')
  );
create policy "reviews: author update" on public.reviews
  for update using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
create policy "reviews: author delete" on public.reviews for delete using (author_id = auth.uid() or public.is_admin());

-- moderation reports
create policy "reports: authenticated create" on public.moderation_reports
  for insert with check (reporter_id = auth.uid());
create policy "reports: reporter or admin read" on public.moderation_reports
  for select using (reporter_id = auth.uid() or public.is_admin());
create policy "reports: admin update" on public.moderation_reports
  for update using (public.is_admin()) with check (public.is_admin());

-- notifications
create policy "notifications: owner read" on public.notifications for select using (user_id = auth.uid());
create policy "notifications: owner update" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit logs: admin read only; inserts go through log_audit() (security definer)
create policy "audit: admin read" on public.audit_logs for select using (public.is_admin());

-- platform settings
create policy "settings: public read" on public.platform_settings for select using (true);
create policy "settings: admin write" on public.platform_settings for all using (public.is_admin()) with check (public.is_admin());

-- rate_limits: no direct access (consume_rate_limit is security definer)

-- Lock down function execution
revoke execute on function public.consume_rate_limit(text, text, int, int) from public, anon;
grant execute on function public.consume_rate_limit(text, text, int, int) to authenticated, service_role;
grant execute on function public.increment_animation_view(text) to anon, authenticated;
grant execute on function public.log_audit(text, text, text, jsonb) to authenticated, service_role;
