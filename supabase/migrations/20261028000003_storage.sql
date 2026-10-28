-- Storage buckets: public assets (logos, covers, menu images, thumbnails), private project assets, private exports.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-assets', 'public-assets', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']),
  ('project-assets', 'project-assets', false, 15728640, array['image/jpeg','image/png','image/webp','image/gif','model/gltf-binary','application/octet-stream']),
  ('exports', 'exports', false, 104857600, array['image/gif','image/png','video/webm','video/mp4','application/zip'])
on conflict (id) do nothing;

-- Object paths are namespaced by the owning user id: <bucket>/<user_id>/...
create policy "public-assets: anyone can read" on storage.objects
  for select using (bucket_id = 'public-assets');
create policy "public-assets: owner write" on storage.objects
  for insert with check (bucket_id = 'public-assets' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "public-assets: owner update" on storage.objects
  for update using (bucket_id = 'public-assets' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "public-assets: owner delete" on storage.objects
  for delete using (bucket_id = 'public-assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "project-assets: owner read" on storage.objects
  for select using (bucket_id = 'project-assets' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));
create policy "project-assets: owner write" on storage.objects
  for insert with check (bucket_id = 'project-assets' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "project-assets: owner delete" on storage.objects
  for delete using (bucket_id = 'project-assets' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "exports: owner read" on storage.objects
  for select using (bucket_id = 'exports' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));
create policy "exports: owner write" on storage.objects
  for insert with check (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "exports: owner delete" on storage.objects
  for delete using (bucket_id = 'exports' and auth.uid()::text = (storage.foldername(name))[1]);
