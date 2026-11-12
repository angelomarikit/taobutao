import { Link, useOutletContext, useParams } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { Artwork, SiteContent } from "@/types";

function WorkCard({ artwork }: { artwork: Artwork }) {
  return (
    <article className="flex flex-col gap-4">
      <Link to={`/gallery/${artwork.slug}`} className="block bg-white">
        {artwork.heroImage ? <img className="block h-auto w-full" src={artwork.heroImage} alt={artwork.heroAlt} /> : null}
      </Link>
      <div className="flex flex-col gap-2">
        <h2 className="h5 text-white">{artwork.title}</h2>
        <p className="b6 text-white">{artwork.medium}</p>
      </div>
    </article>
  );
}

export function ArtistPage() {
  const { slug } = useParams();
  const { artists, artworks } = useOutletContext<SiteContent>();
  const artist = artists.find((item) => item.slug === slug);
  if (!artist) return <NotFoundPage />;
  const works = artworks.filter((artwork) => artwork.artistSlug === artist.slug);

  return (
    <main className="bg-black text-white">
      <PageMeta title={`${artist.name} — ${siteTitle}`} description={artist.biography || artist.name} path={`/gallery/artists/${artist.slug}`} />
      <section className="px-10 pt-[140px] pb-10 max-[810px]:px-5 max-[810px]:pt-[120px]">
        <div className="mx-auto w-full max-w-[1800px]">
          <Link className="b6 text-white" to="/gallery">Gallery</Link>
          <h1 className="h2 mt-6 text-white">{artist.name}</h1>
          {artist.biography ? <p className="b4 mt-6 max-w-[720px] text-white">{artist.biography}</p> : null}
        </div>
      </section>
      {artist.image ? (
        <section className="px-10 pb-16 max-[810px]:px-5">
          <img className="mx-auto block h-auto w-full max-w-[1800px] bg-white" src={artist.image} alt={artist.imageAlt || artist.name} />
        </section>
      ) : null}
      <section className="px-10 pb-[120px] max-[810px]:px-5">
        {works.length ? (
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-3 items-start gap-x-8 gap-y-16 max-[810px]:grid-cols-1">
            {works.map((artwork) => <WorkCard key={artwork.id} artwork={artwork} />)}
          </div>
        ) : (
          <p className="b5 text-white">No items</p>
        )}
      </section>
    </main>
  );
}
