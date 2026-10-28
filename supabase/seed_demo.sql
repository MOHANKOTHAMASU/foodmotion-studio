-- DEMO DATA (development only). Creates demo users via auth schema so RLS can be
-- exercised. Passwords: Demo-Password-123. Run with: pnpm db:seed:demo
-- Labelled "demo" everywhere in the UI via businesses.description prefix and the
-- demo_* usernames.

create or replace function pg_temp.make_user(p_email text, p_name text, p_role text, p_username text)
returns uuid language plpgsql as $$
declare uid uuid := gen_random_uuid();
begin
  if exists (select 1 from auth.users where email = p_email) then
    select id into uid from auth.users where email = p_email;
    return uid;
  end if;
  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change)
  values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', p_email,
    crypt('Demo-Password-123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', p_name, 'requested_role', p_role), now(), now(), '', '', '', '');
  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), uid, uid::text, jsonb_build_object('sub', uid::text, 'email', p_email), 'email', now(), now(), now());
  update public.profiles set username = p_username, onboarding_completed = true, city = 'Hyderabad',
    bio = case when p_role = 'creator' then 'Demo creator account. Food stylist and motion designer.' else null end
  where id = uid;
  return uid;
end $$;

do $$
declare
  owner1 uuid; owner2 uuid; creator1 uuid; customer1 uuid; b1 uuid; b2 uuid; b3 uuid;
  cat_biryani uuid; cat_dosa uuid; cat_coffee uuid; cat_pizza uuid; cat_cakes uuid;
begin
  owner1 := pg_temp.make_user('demo.owner@foodmotion.local', 'Demo Owner (Spice Route)', 'business_owner', 'demo_spiceroute');
  owner2 := pg_temp.make_user('demo.bakery@foodmotion.local', 'Demo Owner (Crumb & Co)', 'business_owner', 'demo_crumbco');
  creator1 := pg_temp.make_user('demo.creator@foodmotion.local', 'Demo Creator (Ananya)', 'creator', 'demo_ananya');
  customer1 := pg_temp.make_user('demo.customer@foodmotion.local', 'Demo Customer', 'customer', 'demo_customer');

  select id into cat_biryani from public.food_categories where slug = 'biryani';
  select id into cat_dosa from public.food_categories where slug = 'dosa';
  select id into cat_coffee from public.food_categories where slug = 'coffee';
  select id into cat_pizza from public.food_categories where slug = 'pizza';
  select id into cat_cakes from public.food_categories where slug = 'cakes';

  insert into public.businesses (owner_id, slug, name, type, tagline, description, cuisines, city, state, phone, price_level, is_published, verification_status, opening_hours, cover_url, address_line1, postal_code)
  values
    (owner1, 'demo-spice-route', 'Spice Route Kitchen', 'restaurant', 'Dum biryani and Andhra meals',
      '[DEMO] A sample restaurant listing used for development and screenshots. Slow-cooked Hyderabadi dum biryani, Andhra thalis and filter coffee.',
      array['Hyderabadi','Andhra','South Indian'], 'Hyderabad', 'Telangana', '+91 98765 43210', 2, true, 'verified',
      '{"mon":"11:00-23:00","tue":"11:00-23:00","wed":"11:00-23:00","thu":"11:00-23:00","fri":"11:00-23:30","sat":"11:00-23:30","sun":"11:00-23:00"}',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&q=80', 'Road No. 12, Banjara Hills', '500034'),
    (owner2, 'demo-crumb-and-co', 'Crumb & Co. Bakehouse', 'bakery', 'Sourdough, celebration cakes, cold brew',
      '[DEMO] A sample bakery listing for development. Small-batch sourdough, custom cakes and specialty coffee.',
      array['Bakery','Desserts','Coffee'], 'Bengaluru', 'Karnataka', '+91 91234 56789', 3, true, 'pending',
      '{"mon":"08:00-21:00","tue":"08:00-21:00","wed":"08:00-21:00","thu":"08:00-21:00","fri":"08:00-22:00","sat":"08:00-22:00","sun":"09:00-20:00"}',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1600&q=80', '12th Main, Indiranagar', '560038'),
    (owner1, 'demo-dosa-express', 'Dosa Express', 'street_food', 'Crisp dosas, 14 chutneys',
      '[DEMO] A sample street-food listing. Ghee roast, podi dosa and filter kaapi served fast.',
      array['South Indian','Street Food'], 'Chennai', 'Tamil Nadu', '+91 99887 76655', 1, true, 'unverified',
      '{"mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-22:00","fri":"07:00-22:00","sat":"07:00-22:00","sun":"07:00-22:00"}',
      'https://images.unsplash.com/photo-1630383249896-424e482df921?w=1600&q=80', 'Besant Nagar Beach Road', '600090')
  on conflict (slug) do update set description = excluded.description;

  select id into b1 from public.businesses where slug = 'demo-spice-route';
  select id into b2 from public.businesses where slug = 'demo-crumb-and-co';
  select id into b3 from public.businesses where slug = 'demo-dosa-express';

  if not exists (select 1 from public.menu_items where business_id = b1) then
    insert into public.menu_items (business_id, category_id, name, description, price_minor, diet, spice_level, prep_time_minutes, image_url, sort_order) values
      (b1, cat_biryani, 'Hyderabadi Chicken Dum Biryani', 'Long-grain basmati, saffron, mint, slow dum for 45 minutes. Served with mirchi ka salan.', 32000, 'non_veg', 2, 35, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', 1),
      (b1, cat_biryani, 'Veg Dum Biryani', 'Seasonal vegetables, fried onions, saffron rice.', 24000, 'veg', 1, 30, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80', 2),
      (b1, cat_dosa, 'Andhra Meals Thali', 'Pappu, gongura, rasam, curd, pickles and papad.', 22000, 'veg', 3, 15, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80', 3),
      (b1, cat_coffee, 'Filter Coffee', 'Chikmagalur beans, brass davara.', 6000, 'veg', 0, 5, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', 4);
    insert into public.menu_items (business_id, category_id, name, description, price_minor, diet, prep_time_minutes, image_url, allergens, sort_order) values
      (b2, cat_cakes, 'Belgian Chocolate Truffle Cake (500g)', 'Dark chocolate sponge, ganache, cocoa nibs.', 89000, 'egg', 0, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', array['gluten','dairy','egg'], 1),
      (b2, cat_cakes, 'Country Sourdough', '36-hour fermented loaf.', 32000, 'vegan', 0, 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&q=80', array['gluten'], 2),
      (b2, cat_coffee, 'Cold Brew Tonic', 'Slow steeped 18 hours, tonic, orange peel.', 28000, 'vegan', 3, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', '{}', 3);
    insert into public.menu_items (business_id, category_id, name, description, price_minor, diet, spice_level, prep_time_minutes, image_url, sort_order) values
      (b3, cat_dosa, 'Ghee Roast Dosa', 'Paper-thin, crisp, generous ghee.', 12000, 'veg', 1, 8, 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80', 1),
      (b3, cat_dosa, 'Podi Masala Dosa', 'Gunpowder-dusted with potato masala.', 14000, 'veg', 2, 10, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80', 2),
      (b3, cat_coffee, 'Filter Kaapi', 'Strong decoction, frothy.', 4000, 'veg', 0, 3, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', 3);
  end if;

  insert into public.subscriptions (user_id, plan, status, mode) values (owner1, 'business_pro', 'active', 'sandbox') on conflict do nothing;
  insert into public.subscriptions (user_id, plan, status, mode) values (creator1, 'creator', 'active', 'sandbox') on conflict do nothing;
end $$;
