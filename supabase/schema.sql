create table if not exists public.profiles (id uuid primary key references auth.users on delete cascade, is_admin boolean not null default false);
create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(), kind text not null check (kind in ('documents','presentations')),
  title text not null, description text not null, category text not null, component text, version text,
  storage_path text not null unique, mime_type text not null, size_bytes bigint not null check (size_bytes > 0),
  is_public boolean not null default false, created_at timestamptz not null default now(), created_by uuid default auth.uid()
);
alter table public.profiles enable row level security; alter table public.library_items enable row level security;
create policy "Public reads approved items" on public.library_items for select using (is_public or exists(select 1 from public.profiles where id=auth.uid() and is_admin));
create policy "Admins insert items" on public.library_items for insert with check (exists(select 1 from public.profiles where id=auth.uid() and is_admin));
create policy "Admins update items" on public.library_items for update using (exists(select 1 from public.profiles where id=auth.uid() and is_admin));
create policy "Admins delete items" on public.library_items for delete using (exists(select 1 from public.profiles where id=auth.uid() and is_admin));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('research-assets','research-assets',false,31457280,array['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation']) on conflict (id) do nothing;
create policy "Public reads approved files" on storage.objects for select using (bucket_id='research-assets' and exists(select 1 from public.library_items where storage_path=name and is_public));
create policy "Admins upload files" on storage.objects for insert with check (bucket_id='research-assets' and exists(select 1 from public.profiles where id=auth.uid() and is_admin));
create policy "Admins delete files" on storage.objects for delete using (bucket_id='research-assets' and exists(select 1 from public.profiles where id=auth.uid() and is_admin));
