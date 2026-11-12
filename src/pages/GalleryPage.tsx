import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { supabase } from "@/lib/supabase";
import { siteTitle } from "@/data/reference";
import { copyText } from "@/lib/content";
import type { Artwork, SiteContent } from "@/types";

function WorkCard({ artwork }: { artwork: Artwork }) {
  return (
    <article className="flex flex-col gap-4">
      <Link to={`/gallery/${artwork.slug}`} className="block bg-white">
        <img className="block h-auto w-full" src={artwork.heroImage} alt={artwork.heroAlt} />
      </Link>
      <div className="flex flex-col gap-2">
        <h2 className="h5 text-white">{artwork.title}</h2>
        <p className="b6 text-white">{artwork.medium}</p>
      </div>
    </article>
  );
}

export function GalleryPage({ artworks }: { artworks: Artwork[] }) {
  const { artists, copy } = useOutletContext<SiteContent>();
  const [collections, setCollections] = useState<Array<{ slug: string; title: string; cover_image: string | null }>>([]);

  useEffect(() => {
    if (!supabase) return;
    void supabase
      .from("gallery_collections")
      .select("slug,title,cover_image")
      .eq("status", "published")
      .order("display_order")
      .then(({ data }) => {
        if (data?.length) setCollections(data);
      });
  }, []);

  return (
    <main className="bg-black text-white">
      <PageMeta
        title={`Gallery — ${siteTitle}`}
        description="Crumpled metal reliefs by TAO BUTAO."
        path="/gallery"
      />
      <section className="px-10 pt-[140px] pb-10 max-[810px]:px-5 max-[810px]:pt-[120px]">
        <div className="mx-auto flex w-full max-w-[1800px] items-end justify-between gap-10 max-[810px]:flex-col max-[810px]:items-start">
          <h1 className="h2 text-white">{copyText(copy, "gallery.intro.heading", "GALLERY")}</h1>
          <p className="b4 max-w-[420px] text-right text-white max-[810px]:text-left">{copyText(copy, "gallery.intro", "Artists of Arte Vista.")}</p>
        </div>
      </section>
      {collections.length ? (
        <section className="px-10 pb-16 max-[810px]:px-5">
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-3 items-start gap-x-8 gap-y-16 max-[810px]:grid-cols-1">
            {collections.map((collection) => (
              <article key={collection.slug} className="flex flex-col gap-4">
                <Link to={`/gallery/collections/${collection.slug}`} className="block bg-white">
                  {collection.cover_image ? <img className="block h-auto w-full" src={collection.cover_image} alt={collection.title} /> : null}
                </Link>
                <div className="flex flex-col gap-2">
                  <h2 className="h5 text-white">{collection.title}</h2>
                  <p className="b6 text-white">Collection</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section className="px-10 pb-16 max-[810px]:px-5">
        <div className="mx-auto w-full max-w-[1800px]">
          <h2 className="h5 text-white">Artists</h2>
          <div className="mt-8 grid grid-cols-3 items-start gap-x-8 gap-y-16 max-[810px]:grid-cols-1">
            {artists.map((artist) => (
              <article key={artist.id} className="flex flex-col gap-4">
                <Link to={`/gallery/artists/${artist.slug}`} className="block bg-white">
                  {artist.image ? <img className="block h-auto w-full" src={artist.image} alt={artist.imageAlt || artist.name} /> : <span className="block min-h-40" />}
                </Link>
                <div className="flex flex-col gap-2">
                  <h3 className="h5 text-white">{artist.name}</h3>
                  <p className="b6 text-white">Artist</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="px-10 pb-[120px] max-[810px]:px-5 max-[810px]:pb-[100px]">
        {artworks.length ? (
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-3 items-start gap-x-8 gap-y-16 max-[810px]:grid-cols-1 max-[810px]:gap-y-12">
            {artworks.map((artwork) => (
              <WorkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="b5 text-white">No items</p>
        )}
      </section>
    </main>
  );
}
