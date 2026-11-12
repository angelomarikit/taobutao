import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { supabase } from "@/lib/supabase";
import { NotFoundPage } from "@/pages/NotFoundPage";

type CollectionImage = { id: string; image_url: string; alt_text: string | null; caption: string | null };
type Collection = { title: string; description: string | null; images: CollectionImage[] };

export function CollectionPage() {
  const { slug } = useParams();
  const [state, setState] = useState<"loading" | "missing" | "ready">("loading");
  const [collection, setCollection] = useState<Collection | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!supabase || !slug) {
        setState("missing");
        return;
      }
      const { data, error } = await supabase
        .from("gallery_collections")
        .select("title,description,collection_images(id,image_url,alt_text,caption,display_order)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (ignore) return;
      if (error || !data) {
        setState("missing");
        return;
      }
      const images = ((data.collection_images ?? []) as CollectionImage[])
        .slice()
        .sort((a, b) => Number((a as CollectionImage & { display_order?: number }).display_order ?? 0) - Number((b as CollectionImage & { display_order?: number }).display_order ?? 0));
      setCollection({ title: data.title, description: data.description, images });
      setState("ready");
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (active === null || !collection) return;
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((active + 1) % collection.images.length);
      if (event.key === "ArrowLeft") setActive((active - 1 + collection.images.length) % collection.images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, collection]);

  if (state === "missing") return <NotFoundPage />;
  if (state === "loading" || !collection) {
    return <main className="min-h-screen bg-black" />;
  }

  const current = active === null ? null : collection.images[active];

  return (
    <main className="bg-black text-white">
      <PageMeta title={`${collection.title} — ${siteTitle}`} description={collection.description || collection.title} path={`/gallery/collections/${slug}`} />
      <section className="px-10 pt-[140px] pb-10 max-[810px]:px-5 max-[810px]:pt-[120px]">
        <div className="mx-auto w-full max-w-[1800px]">
          <Link className="b6 text-white" to="/gallery">Gallery</Link>
          <h1 className="h2 mt-6 text-white">{collection.title}</h1>
          {collection.description ? <p className="b4 mt-6 max-w-[640px] text-white">{collection.description}</p> : null}
        </div>
      </section>
      <section className="px-10 pb-[120px] max-[810px]:px-5">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-3 items-start gap-x-8 gap-y-16 max-[810px]:grid-cols-1">
          {collection.images.map((image, index) => (
            <button key={image.id} className="block bg-white text-left" type="button" onClick={() => setActive(index)}>
              <img className="block h-auto w-full" src={image.image_url} alt={image.alt_text || collection.title} />
              {image.caption ? <span className="b6 block px-0 py-3 text-white">{image.caption}</span> : null}
            </button>
          ))}
        </div>
      </section>
      {current ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-6" role="dialog" aria-modal="true">
          <button className="absolute top-6 right-6 b6 text-white" type="button" onClick={() => setActive(null)}>Close</button>
          <button className="absolute left-4 b6 text-white" type="button" onClick={() => setActive((active! - 1 + collection.images.length) % collection.images.length)}>Previous</button>
          <img className="max-h-[86vh] max-w-[90vw] object-contain" src={current.image_url} alt={current.alt_text || collection.title} />
          <button className="absolute right-4 b6 text-white" type="button" onClick={() => setActive((active! + 1) % collection.images.length)}>Next</button>
        </div>
      ) : null}
    </main>
  );
}
