-- Development seed: categories, templates and clearly-labelled DEMO businesses.
-- Safe to run repeatedly. Never run against production without review.

insert into public.food_categories (slug, name, emoji, description, sort_order) values
  ('burgers', 'Burgers', '🍔', 'Stacked, saucy, smashed.', 1),
  ('pizza', 'Pizza', '🍕', 'Wood-fired and pan-baked.', 2),
  ('dosa', 'Dosa & South Indian', '🫓', 'Crisp dosas, idli and filter coffee.', 3),
  ('biryani', 'Biryani', '🍛', 'Dum-cooked, layered and fragrant.', 4),
  ('cakes', 'Cakes & Bakes', '🎂', 'Celebration cakes and pastries.', 5),
  ('ice-cream', 'Ice Cream', '🍨', 'Scoops, sundaes and kulfi.', 6),
  ('noodles', 'Noodles', '🍜', 'Hakka, ramen and pan-tossed.', 7),
  ('coffee', 'Coffee & Beverages', '☕', 'Espresso, filter kaapi and shakes.', 8),
  ('fruit', 'Fruit & Smoothies', '🍓', 'Fresh cut and blended.', 9),
  ('desserts', 'Desserts', '🍮', 'Chocolate, mithai and plated desserts.', 10),
  ('street-food', 'Street Food', '🌮', 'Chaat, rolls and vada pav.', 11),
  ('thali', 'Thali & Meals', '🍽️', 'Regional full meals.', 12)
on conflict (slug) do update set name = excluded.name, emoji = excluded.emoji, description = excluded.description, sort_order = excluded.sort_order;

insert into public.animation_templates (slug, name, category_slug, description, is_featured, sort_order) values
  ('burger-assembly', 'Burger assembly', 'burgers', 'Ingredients drop and stack into a finished burger.', true, 1),
  ('pizza-oven', 'Pizza oven sequence', 'pizza', 'Dough, sauce, toppings and a fiery oven reveal.', true, 2),
  ('dosa-spread', 'Dosa spread', 'dosa', 'Batter spreads on the tawa and crisps to golden.', true, 3),
  ('biryani-dum', 'Biryani dum', 'biryani', 'Rice, masala and saffron combine under the lid.', true, 4),
  ('cake-frosting', 'Cake frosting', 'cakes', 'Layers stack, frosting swirls, berries land.', false, 5),
  ('coffee-pour', 'Coffee pour & latte art', 'coffee', 'Espresso pour, milk swirl and a heart on top.', true, 6),
  ('fruit-smoothie', 'Fruit cut & blend', 'fruit', 'Fruit slices fall into a blender and whirl.', false, 7),
  ('ice-cream-scoop', 'Ice cream scoop', 'ice-cream', 'Scoops land in a cone with toppings.', false, 8),
  ('chocolate-pour', 'Chocolate pour', 'desserts', 'Molten chocolate cascades over a dessert.', false, 9),
  ('dish-reveal', 'Cinematic dish reveal', 'thali', 'Cloche lifts, steam rises, light sweeps.', true, 10)
on conflict (slug) do update set name = excluded.name, description = excluded.description, is_featured = excluded.is_featured, sort_order = excluded.sort_order;

insert into public.platform_settings (key, value) values
  ('plans', '{
    "free_starter": {"name":"Free Starter","price_minor":0,"projects":10,"export_credits":5,"storage_mb":200,"watermark":true,"team":false},
    "creator": {"name":"Creator","price_minor":49900,"projects":50,"export_credits":60,"storage_mb":2048,"watermark":false,"team":false},
    "business_pro": {"name":"Business Pro","price_minor":149900,"projects":200,"export_credits":300,"storage_mb":10240,"watermark":false,"team":true},
    "enterprise": {"name":"Enterprise","price_minor":null,"projects":null,"export_credits":null,"storage_mb":null,"watermark":false,"team":true}
  }'::jsonb),
  ('ordering_enabled', 'false'::jsonb),
  ('payments_mode', '"sandbox"'::jsonb)
on conflict (key) do update set value = excluded.value;
