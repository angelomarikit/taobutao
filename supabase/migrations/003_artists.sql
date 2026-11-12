-- Run this after 001_schema.sql and 002_cms_collections.sql.
-- It does not drop tables or delete rows.
-- It adds TAO BUTAO as a published artist only when that page address is not already used.
-- The biography is split so the SQL editor does not read the word "into" as a table name.

insert into public.artists (name, slug, biography, profile_image, featured, status)
values (
  'TAO BUTAO',
  'tao-butao',
  'TAO BUTAO crumples metal in' || 'to unpredictable folds, an echo of the volatility and uncertainty of reality. Each surface holds the marks of pressure, endurance, and renewal.',
  '/media/about-black-reliefs.jpg',
  true,
  'published'
)
on conflict (slug) do nothing;
