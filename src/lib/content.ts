import { useEffect, useState } from "react";
import { referenceArtists, referenceArticles, referenceArtworks, referenceEvents } from "@/data/reference";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Artist, Artwork, Exhibition, GalleryCollection, JournalArticle, RichBlock, SiteContent } from "@/types";

type LoadState = {
  status: "loading" | "ready" | "error";
  content: SiteContent;
  message?: string;
};

const referenceContent: SiteContent = {
  source: "reference",
  artworks: referenceArtworks,
  artists: referenceArtists,
  articles: referenceArticles,
  exhibitions: referenceEvents,
  collections: [],
  copy: {},
};

async function loadArtists(): Promise<Artist[]> {
  if (!supabase) return referenceArtists;
  const { data, error } = await supabase
    .from("artists")
    .select("id,name,slug,biography,profile_image")
    .eq("status", "published")
    .order("name");
  if (error) return referenceArtists;
  const published = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    biography: row.biography || "",
    image: row.profile_image || "",
    imageAlt: row.name,
  }));
  const slugs = new Set(published.map((artist) => artist.slug));
  return [...published, ...referenceArtists.filter((artist) => !slugs.has(artist.slug))];
}

function asBlocks(value: unknown): RichBlock[] {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((block) => {
    if (!block || typeof block !== "object") return [];
    const row = block as { tag?: string; text?: string };
    if (!row.text || (row.tag !== "p" && row.tag !== "h2" && row.tag !== "h4")) return [];
    return [{ tag: row.tag, text: row.text }];
  });
}

export function copyText(copy: Record<string, string> | undefined, key: string, fallback: string) {
  const value = copy?.[key]?.trim();
  return value ? value : fallback;
}

export function copyBlocks(copy: Record<string, string> | undefined, key: string, fallback: string) {
  return copyText(copy, key, fallback).split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

async function loadPublishedExtras(): Promise<{ collections: GalleryCollection[]; copy: Record<string, string> }> {
  const empty = { collections: [] as GalleryCollection[], copy: {} as Record<string, string> };
  if (!supabase) return empty;

  const [collectionsResult, sectionsResult, settingsResult] = await Promise.all([
    supabase
      .from("gallery_collections")
      .select(
        "id,title,slug,description,cover_image,display_order,collection_images(image_url,caption,alt_text,display_order),collection_artworks(display_order,artworks(title,slug,published,artwork_images(image_url,alt_text,is_primary,display_order)))",
      )
      .eq("status", "published")
      .order("display_order"),
    supabase.from("page_sections").select("page,section_key,heading,body,image_url,link_url").eq("visible", true),
    supabase.from("site_settings").select("key,value"),
  ]);

  const collections: GalleryCollection[] = collectionsResult.error
    ? []
    : (collectionsResult.data ?? []).map((row) => {
        const standalone = [...(row.collection_images ?? [])]
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((image) => ({
            src: image.image_url as string,
            alt: (image.alt_text as string | null) || row.title,
            caption: (image.caption as string | null) || "",
          }));
        const linked = [...(row.collection_artworks ?? [])]
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .flatMap((link) => {
            const artwork = Array.isArray(link.artworks) ? link.artworks[0] : link.artworks;
            if (!artwork || artwork.published === false) return [];
            const pictures = [...(artwork.artwork_images ?? [])].sort(
              (a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.display_order ?? 0) - (b.display_order ?? 0),
            );
            const primary = pictures[0];
            if (!primary?.image_url) return [];
            return [{ src: primary.image_url as string, alt: (primary.alt_text as string | null) || artwork.title, caption: artwork.title as string }];
          });
        const images = [...standalone];
        for (const image of linked) {
          if (!images.some((item) => item.src === image.src)) images.push(image);
        }
        return {
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description || "",
          cover: row.cover_image || images[0]?.src || "",
          images,
        };
      });

  const copy: Record<string, string> = {};
  if (!sectionsResult.error) {
    for (const row of sectionsResult.data ?? []) {
      const key = `${row.page}.${row.section_key}`;
      if (row.body) copy[key] = row.body;
      if (row.heading) copy[`${key}.heading`] = row.heading;
      if (row.image_url) copy[`${key}.image`] = row.image_url;
      if (row.link_url) copy[`${key}.link`] = row.link_url;
    }
  }
  if (!settingsResult.error) {
    for (const row of settingsResult.data ?? []) copy[`settings.${row.key}`] = row.value;
  }
  return { collections, copy };
}

function dimensionLabel(row: {
  medium: string | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  dimensions_unit: string | null;
}) {
  const parts = [row.width, row.height, row.depth].filter((value) => value != null);
  const size = parts.length ? `${parts.join(" × ")} ${row.dimensions_unit || ""}`.trim() : "";
  return [row.medium, size].filter(Boolean).join(" · ");
}

export function useSiteContent(): LoadState {
  const [state, setState] = useState<LoadState>({
    status: "ready",
    content: referenceContent,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabase) {
        if (!cancelled) setState({ status: "ready", content: referenceContent });
        return;
      }

      const [artworksResult, articlesResult, exhibitionsResult] = await Promise.all([
        supabase
          .from("artworks")
          .select(
            "id,title,slug,description,medium,width,height,depth,dimensions_unit,availability_status,featured,published,artists(name,slug,biography,profile_image),artwork_images(image_url,alt_text,display_order,is_primary)",
          )
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("journal_posts")
          .select(
            "id,title,slug,category,author,role,published_on,read_time,excerpt,hero_heading,featured_image,content,published",
          )
          .eq("published", true)
          .order("published_on", { ascending: false }),
        supabase
          .from("exhibitions")
          .select("id,title,description,location,start_date,status,published")
          .eq("published", true)
          .order("start_date", { ascending: true }),
      ]);

      if (cancelled) return;

      const extras = await loadPublishedExtras();
      const artists = await loadArtists();
      if (cancelled) return;

      const failed = artworksResult.error || articlesResult.error || exhibitionsResult.error;
      if (failed) {
        setState({
          status: "error",
          content: { ...referenceContent, artists, collections: extras.collections, copy: extras.copy },
          message: failed.message,
        });
        return;
      }

      const hasRows = Boolean(artworksResult.data?.length || articlesResult.data?.length || exhibitionsResult.data?.length);
      if (!hasRows) {
        setState({
          status: "ready",
          content: { ...referenceContent, artists, collections: extras.collections, copy: extras.copy },
        });
        return;
      }

      const artworks: Artwork[] = (artworksResult.data ?? []).map((row) => {
        const artist = Array.isArray(row.artists) ? row.artists[0] : row.artists;
        const images = [...(row.artwork_images ?? [])].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        );
        const primary = images.find((image) => image.is_primary) ?? images[0];
        const detail = images[1] ?? primary;
        return {
          id: row.id,
          title: row.title,
          slug: row.slug,
          medium: dimensionLabel(row),
          heroImage: primary?.image_url || "",
          heroAlt: primary?.alt_text || row.title,
          detailImage: detail?.image_url || primary?.image_url || "",
          detailDescription: row.description || "",
          artistName: artist?.name || "",
          artistSlug: artist?.slug || "",
          artistAge: "",
          artistImage: artist?.profile_image || "",
          biography: artist?.biography || "",
          accolades: "",
          contactLink: "mailto:tommydreamchaser@gmail.com",
          availability: row.availability_status,
          featured: row.featured,
          published: row.published,
        };
      });

      const articles: JournalArticle[] = (articlesResult.data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category || "",
        author: row.author || "",
        role: row.role || "",
        publishedOn: row.published_on || "",
        readTime: row.read_time || "",
        excerpt: row.excerpt || "",
        heroHeading: row.hero_heading || "",
        image: row.featured_image || "",
        imageAlt: row.title,
        content: asBlocks(row.content),
        published: row.published,
      }));

      const exhibitions: Exhibition[] = (exhibitionsResult.data ?? []).map((row) => {
        const date = row.start_date ? new Date(row.start_date) : null;
        const day = date ? String(date.getUTCDate()) : "";
        const when = date
          ? `${date.toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toUpperCase()}`
          : "";
        return {
          id: row.id,
          day,
          when,
          title: row.title,
          description: row.description || "",
          location: row.location || "",
          link: "mailto:tommydreamchaser@gmail.com",
        };
      });

      setState({
        status: "ready",
        content: {
          source: "supabase",
          artworks: artworks.length ? artworks : referenceArtworks,
          artists,
          articles: articles.length ? articles : referenceArticles,
          exhibitions: exhibitions.length ? exhibitions : referenceEvents,
          collections: extras.collections,
          copy: extras.copy,
        },
      });
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export async function submitInquiry(input: {
  name: string;
  email: string;
  message: string;
  inquiryType: string;
  artworkId?: string;
  phone?: string;
  subject?: string;
}) {
  if (!supabaseConfigured || !supabase) {
    return { ok: false as const, message: "The enquiry service is not connected yet." };
  }

  const { error } = await supabase.from("inquiries").insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    subject: input.subject || null,
    message: input.message,
    inquiry_type: input.inquiryType,
    artwork_id: input.artworkId ?? null,
    status: "new",
  });

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
}

export { supabaseConfigured };
