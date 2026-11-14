-- Registration requests. Run this whole file once in the Supabase SQL editor.
-- A new account cannot use the CMS until an administrator approves it.

create table if not exists public.admin_applications (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.admin_applications enable row level security;

grant select, insert, update on table public.admin_applications to authenticated;

drop policy if exists "applicant inserts own request" on public.admin_applications;
create policy "applicant inserts own request" on public.admin_applications
for insert to authenticated
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "applicant or admin reads requests" on public.admin_applications;
create policy "applicant or admin reads requests" on public.admin_applications
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins review requests" on public.admin_applications;
create policy "admins review requests" on public.admin_applications
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins create editor profiles" on public.admin_profiles;
create policy "admins create editor profiles" on public.admin_profiles
for insert to authenticated
with check (public.is_admin() and role = 'editor');
