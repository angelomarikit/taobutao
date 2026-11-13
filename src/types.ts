export type RichBlock = {
  tag: "p" | "h2" | "h4";
  text: string;
};

export type Artwork = {
  id: string;
  title: string;
  slug: string;
  medium: string;
  heroImage: string;
  heroAlt: string;
  detailImage: string;
  detailDescription: string;
  artistName: string;
  artistSlug: string;
  artistAge: string;
  artistImage: string;
  biography: string;
  accolades: string;
  contactLink: string;
  availability: "available" | "reserved" | "sold";
  featured: boolean;
  published: boolean;
};

export type JournalArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  role: string;
  publishedOn: string;
  readTime: string;
  excerpt: string;
  heroHeading: string;
  image: string;
  imageAlt: string;
  content: RichBlock[];
  gallery?: { src: string; alt: string }[];
  published: boolean;
};

export type Exhibition = {
  id: string;
  slug: string;
  day: string;
  when: string;
  title: string;
  description: string;
  location: string;
  link: string;
  image: string;
  imageAlt: string;
  startDate: string;
  endDate: string;
  status: "current" | "upcoming" | "past";
};

export type TeamMember = {
  role: string;
  name: string;
  bio: string;
  image?: string;
};

export type Artist = {
  id: string;
  name: string;
  slug: string;
  biography: string;
  image: string;
  imageAlt: string;
};

export type GalleryCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover: string;
  images: { src: string; alt: string; caption: string }[];
};

export type AuctionLot = {
  id: string;
  lotNumber: number;
  artistName: string;
  title: string;
  image: string;
  price: number | null;
  currency: string;
};

export type Auction = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "live" | "upcoming" | "previous";
  lots: AuctionLot[];
};

export type SiteContent = {
  source: "reference" | "supabase";
  artworks: Artwork[];
  artists: Artist[];
  articles: JournalArticle[];
  exhibitions: Exhibition[];
  auctions: Auction[];
  collections: GalleryCollection[];
  copy: Record<string, string>;
};
