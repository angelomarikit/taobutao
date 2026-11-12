-- Run this after 001_schema.sql, in the Supabase SQL Editor.
-- It only adds tables, columns, functions, and policies.
-- It does not drop existing tables or delete existing rows.
-- Do not put the service role key in the frontend.
-- The public site keeps its current content until these tables contain published rows.

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid()
      and role = 'owner'
  );
$$;

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('home', 'about', 'contact', 'footer')),
  section_key text not null check (char_length(section_key) between 1 and 80),
  heading text,
  body text,
  image_url text,
  link_url text,
  visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page, section_key)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'gallery',
  path text not null,
  public_url text not null,
  label text,
  mime_type text,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.gallery_collections (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  cover_image text,
  category_id uuid references public.artwork_categories (id) on delete set null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.collection_images (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.gallery_collections (id) on delete cascade,
  image_url text not null,
  media_asset_id uuid references public.media_assets (id) on delete set null,
  caption text,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_artworks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.gallery_collections (id) on delete cascade,
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  display_order integer not null default 0,
  unique (collection_id, artwork_id)
);

alter table public.journal_posts add column if not exists featured boolean not null default false;
alter table public.journal_posts add column if not exists seo_title text;
alter table public.journal_posts add column if not exists seo_description text;

drop trigger if exists page_sections_updated_at on public.page_sections;
create trigger page_sections_updated_at before update on public.page_sections
for each row execute function public.set_updated_at();

drop trigger if exists gallery_collections_updated_at on public.gallery_collections;
create trigger gallery_collections_updated_at before update on public.gallery_collections
for each row execute function public.set_updated_at();

create index if not exists gallery_collections_status_idx on public.gallery_collections (status, display_order);
create index if not exists collection_images_order_idx on public.collection_images (collection_id, display_order);
create index if not exists collection_artworks_order_idx on public.collection_artworks (collection_id, display_order);

alter table public.page_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.gallery_collections enable row level security;
alter table public.collection_images enable row level security;
alter table public.collection_artworks enable row level security;

drop policy if exists "public reads visible page sections" on public.page_sections;
create policy "public reads visible page sections" on public.page_sections
for select using (visible = true or public.is_admin());
drop policy if exists "admins write page sections" on public.page_sections;
create policy "admins write page sections" on public.page_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read media" on public.media_assets;
create policy "admins read media" on public.media_assets
for select using (public.is_admin());
drop policy if exists "admins write media" on public.media_assets;
create policy "admins write media" on public.media_assets
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads published collections" on public.gallery_collections;
create policy "public reads published collections" on public.gallery_collections
for select using (status = 'published' or public.is_admin());
drop policy if exists "admins write collections" on public.gallery_collections;
create policy "admins write collections" on public.gallery_collections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads images of published collections" on public.collection_images;
create policy "public reads images of published collections" on public.collection_images
for select using (
  public.is_admin() or exists (
    select 1 from public.gallery_collections
    where gallery_collections.id = collection_images.collection_id
      and gallery_collections.status = 'published'
  )
);
drop policy if exists "admins write collection images" on public.collection_images;
create policy "admins write collection images" on public.collection_images
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads artworks of published collections" on public.collection_artworks;
create policy "public reads artworks of published collections" on public.collection_artworks
for select using (
  public.is_admin() or exists (
    select 1 from public.gallery_collections
    where gallery_collections.id = collection_artworks.collection_id
      and gallery_collections.status = 'published'
  )
);
drop policy if exists "admins write collection artworks" on public.collection_artworks;
create policy "admins write collection artworks" on public.collection_artworks
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write admin profiles" on public.admin_profiles;
create policy "owners write admin profiles" on public.admin_profiles
for all using (public.is_owner()) with check (public.is_owner());
