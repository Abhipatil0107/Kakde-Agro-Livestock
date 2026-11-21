-- Run this entire script in Supabase SQL Editor.
-- The public website can read only published photos and updates.
-- Only authenticated users can read/write the private ledger and manage content.

create table if not exists public.farm_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.farm_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.farm_ledger (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('income','expense')),
  amount numeric(12,2) not null check (amount > 0),
  crop text not null,
  category text not null,
  entry_date date not null default current_date,
  notes text default '',
  created_at timestamptz not null default now()
);

alter table public.farm_photos enable row level security;
alter table public.farm_updates enable row level security;
alter table public.farm_ledger enable row level security;

drop policy if exists "Public can read published photos" on public.farm_photos;
create policy "Public can read published photos" on public.farm_photos
for select using (published = true);

drop policy if exists "Authenticated admins manage photos" on public.farm_photos;
create policy "Authenticated admins manage photos" on public.farm_photos
for all to authenticated using (true) with check (true);

drop policy if exists "Public can read published updates" on public.farm_updates;
create policy "Public can read published updates" on public.farm_updates
for select using (published = true);

drop policy if exists "Authenticated admins manage updates" on public.farm_updates;
create policy "Authenticated admins manage updates" on public.farm_updates
for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins manage ledger" on public.farm_ledger;
create policy "Authenticated admins manage ledger" on public.farm_ledger
for all to authenticated using (true) with check (true);

-- Storage bucket for gallery images. Public read is needed to display published images.
insert into storage.buckets (id, name, public)
values ('farm-gallery', 'farm-gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public can view farm gallery" on storage.objects;
create policy "Public can view farm gallery" on storage.objects
for select using (bucket_id = 'farm-gallery');

drop policy if exists "Authenticated admins upload farm gallery" on storage.objects;
create policy "Authenticated admins upload farm gallery" on storage.objects
for insert to authenticated with check (bucket_id = 'farm-gallery');

drop policy if exists "Authenticated admins update farm gallery" on storage.objects;
create policy "Authenticated admins update farm gallery" on storage.objects
for update to authenticated using (bucket_id = 'farm-gallery') with check (bucket_id = 'farm-gallery');

drop policy if exists "Authenticated admins delete farm gallery" on storage.objects;
create policy "Authenticated admins delete farm gallery" on storage.objects
for delete to authenticated using (bucket_id = 'farm-gallery');

-- IMPORTANT: create your own admin user in Supabase Authentication.
-- Disable public sign-ups in Supabase Auth settings after creating the admin user.
-- For stronger single-admin restriction, use an allow-list policy based on auth.uid()
-- after creating the admin account, replacing the broad authenticated policies above.
