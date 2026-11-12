-- TAO BUTAO gallery schema
-- Run this file once in the Supabase SQL Editor.
-- Do not place the service role key in the frontend.
-- After it succeeds:
-- 1. Create an email user in Authentication.
-- 2. Run the admin insert at the bottom of this file with that user's id.
-- 3. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.
-- 4. Optional: run 002_seed_reference.sql to load the Novum reference content.

-- pgcrypto is already installed on Supabase. gen_random_uuid() is built into
-- Postgres 13+, so this file does not run CREATE EXTENSION. The SQL Editor
-- wraps the script in a transaction, and CREATE EXTENSION fails there with
-- "cannot execute CREATE EXTENSION in a read-only transaction".

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  biography text,
  profile_image text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artwork_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now()
);

create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  artist_id uuid references public.artists (id) on delete set null,
  description text,
  medium text,
  category_id uuid references public.artwork_categories (id) on delete set null,
  year_created integer check (year_created is null or year_created between 1000 and 2500),
  width numeric check (width is null or width >= 0),
  height numeric check (height is null or height >= 0),
  depth numeric check (depth is null or depth >= 0),
  dimensions_unit text not null default 'cm' check (dimensions_unit in ('cm', 'in', 'mm')),
  price numeric check (price is null or price >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  availability_status text not null default 'available' check (availability_status in ('available', 'reserved', 'sold')),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.artwork_images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index artwork_images_one_primary
  on public.artwork_images (artwork_id)
  where is_primary;

create table public.exhibitions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  cover_image text,
  start_date date,
  end_date date,
  location text,
  status text not null default 'upcoming' check (status in ('current', 'upcoming', 'past')),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.exhibition_artworks (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions (id) on delete cascade,
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  display_order integer not null default 0,
  unique (exhibition_id, artwork_id)
);

create table public.exhibition_artists (
  id uuid primary key default gen_random_uuid(),
  exhibition_id uuid not null references public.exhibitions (id) on delete cascade,
  artist_id uuid not null references public.artists (id) on delete cascade,
  unique (exhibition_id, artist_id)
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text check (subject is null or char_length(subject) <= 200),
  message text not null check (char_length(message) between 1 and 4000),
  artwork_id uuid references public.artworks (id) on delete set null,
  inquiry_type text not null default 'general' check (inquiry_type in ('general', 'artwork', 'newsletter', 'visit')),
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (char_length(key) between 1 and 80),
  value text not null,
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

-- The public Journal pages exist in the reference design, so they have their own table.
create table public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 240),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text,
  author text,
  role text,
  published_on date,
  read_time text,
  excerpt text,
  hero_heading text,
  featured_image text,
  content text not null default '[]',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artworks_published_idx on public.artworks (published, featured);
create index artworks_artist_idx on public.artworks (artist_id);
create index artworks_category_idx on public.artworks (category_id);
create index artwork_images_artwork_idx on public.artwork_images (artwork_id, display_order);
create index exhibitions_published_idx on public.exhibitions (published, start_date);
create index inquiries_status_idx on public.inquiries (status, created_at desc);
create index inquiries_email_idx on public.inquiries (email, created_at desc);
create index journal_posts_published_idx on public.journal_posts (published, published_on desc);

create trigger artists_updated_at before update on public.artists
for each row execute function public.set_updated_at();
create trigger artworks_updated_at before update on public.artworks
for each row execute function public.set_updated_at();
create trigger exhibitions_updated_at before update on public.exhibitions
for each row execute function public.set_updated_at();
create trigger journal_posts_updated_at before update on public.journal_posts
for each row execute function public.set_updated_at();
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

create or replace function public.guard_inquiry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.inquiries
  where email = new.email
    and created_at > now() - interval '10 minutes';

  if recent_count >= 5 then
    raise exception 'Too many enquiries from this email';
  end if;

  return new;
end;
$$;

create trigger inquiries_guard
before insert on public.inquiries
for each row execute function public.guard_inquiry();

alter table public.artists enable row level security;
alter table public.artwork_categories enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_images enable row level security;
alter table public.exhibitions enable row level security;
alter table public.exhibition_artworks enable row level security;
alter table public.exhibition_artists enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.journal_posts enable row level security;

create policy "public reads published artists" on public.artists
for select using (status = 'published' or public.is_admin());
create policy "admins write artists" on public.artists
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads categories" on public.artwork_categories
for select using (true);
create policy "admins write categories" on public.artwork_categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published artworks" on public.artworks
for select using (published = true or public.is_admin());
create policy "admins write artworks" on public.artworks
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads images of published artworks" on public.artwork_images
for select using (
  public.is_admin() or exists (
    select 1 from public.artworks
    where artworks.id = artwork_images.artwork_id and artworks.published = true
  )
);
create policy "admins write artwork images" on public.artwork_images
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published exhibitions" on public.exhibitions
for select using (published = true or public.is_admin());
create policy "admins write exhibitions" on public.exhibitions
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads exhibition artworks" on public.exhibition_artworks
for select using (
  public.is_admin() or exists (
    select 1 from public.exhibitions
    where exhibitions.id = exhibition_artworks.exhibition_id and exhibitions.published = true
  )
);
create policy "admins write exhibition artworks" on public.exhibition_artworks
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads exhibition artists" on public.exhibition_artists
for select using (
  public.is_admin() or exists (
    select 1 from public.exhibitions
    where exhibitions.id = exhibition_artists.exhibition_id and exhibitions.published = true
  )
);
create policy "admins write exhibition artists" on public.exhibition_artists
for all using (public.is_admin()) with check (public.is_admin());

create policy "public inserts enquiries" on public.inquiries
for insert with check (status = 'new');
create policy "admins read and update enquiries" on public.inquiries
for select using (public.is_admin());
create policy "admins update enquiries" on public.inquiries
for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete enquiries" on public.inquiries
for delete using (public.is_admin());

create policy "public reads settings" on public.site_settings
for select using (true);
create policy "admins write settings" on public.site_settings
for all using (public.is_admin()) with check (public.is_admin());

create policy "admins read admin profiles" on public.admin_profiles
for select using (public.is_admin() or user_id = auth.uid());
create policy "admins write admin profiles" on public.admin_profiles
for all using (public.is_admin()) with check (public.is_admin());

create policy "public reads published journal" on public.journal_posts
for select using (published = true or public.is_admin());
create policy "admins write journal" on public.journal_posts
for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "public reads gallery files" on storage.objects
for select using (bucket_id = 'gallery');
create policy "admins upload gallery files" on storage.objects
for insert with check (bucket_id = 'gallery' and public.is_admin());
create policy "admins update gallery files" on storage.objects
for update using (bucket_id = 'gallery' and public.is_admin())
with check (bucket_id = 'gallery' and public.is_admin());
create policy "admins delete gallery files" on storage.objects
for delete using (bucket_id = 'gallery' and public.is_admin());

-- Replace the uuid, then run this after the Auth user exists:
-- insert into public.admin_profiles (user_id, full_name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'Gallery Owner', 'owner');
