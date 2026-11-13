-- Auctions and lots. Run this whole file once in the Supabase SQL editor.
-- It only adds tables. It does not remove existing data.

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  cover_image text,
  start_date date,
  end_date date,
  location text,
  status text not null default 'upcoming' check (status in ('live', 'upcoming', 'previous')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.auction_lots (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions (id) on delete cascade,
  lot_number integer not null check (lot_number > 0),
  artist_name text,
  title text not null check (char_length(title) between 1 and 200),
  image_url text,
  price numeric check (price is null or price >= 0),
  currency text not null default 'PHP' check (char_length(currency) = 3),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (auction_id, lot_number)
);

drop trigger if exists auctions_updated_at on public.auctions;
create trigger auctions_updated_at before update on public.auctions
for each row execute function public.set_updated_at();

alter table public.auctions enable row level security;
alter table public.auction_lots enable row level security;

drop policy if exists "public reads published auctions" on public.auctions;
create policy "public reads published auctions" on public.auctions
for select using (published = true or public.is_admin());

drop policy if exists "admins write auctions" on public.auctions;
create policy "admins write auctions" on public.auctions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public reads lots of published auctions" on public.auction_lots;
create policy "public reads lots of published auctions" on public.auction_lots
for select using (
  public.is_admin() or exists (
    select 1 from public.auctions
    where auctions.id = auction_lots.auction_id and auctions.published = true
  )
);

drop policy if exists "admins write auction lots" on public.auction_lots;
create policy "admins write auction lots" on public.auction_lots
for all using (public.is_admin()) with check (public.is_admin());
