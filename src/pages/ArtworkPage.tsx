import { Link } from "react-router-dom";
import { PageMeta, TextLink } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { siteOrigin } from "@/lib/supabase";
import type { Artwork } from "@/types";

export function ArtworkPage({ artwork, next }: { artwork: Artwork; next?: Artwork }) {
  return (
    <main className="bg-black text-white">
      <PageMeta
        title={`${artwork.title} — ${siteTitle}`}
        description={artwork.detailDescription}
        path={`/gallery/${artwork.slug}`}
        image={artwork.heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "VisualArtwork",
          name: artwork.title,
          artMedium: artwork.medium,
          creator: { "@type": "Person", name: artwork.artistName },
          image: artwork.heroImage,
          url: `${siteOrigin()}/gallery/${artwork.slug}`,
        }}
      />

      <section className="bg-black px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-16">
        <article className="mx-auto flex w-full max-w-[800px] flex-col gap-2.5">
          <img className="block h-auto w-full bg-white" src={artwork.heroImage} alt={artwork.heroAlt} />
          <div className="flex items-end justify-between gap-6 max-[810px]:flex-col max-[810px]:items-start">
            <h1 className="h4 text-white">{artwork.title}</h1>
            <p className="b5 text-white">{artwork.medium}</p>
          </div>
        </article>
      </section>

      <section className="bg-black px-10 py-[120px] text-white max-[810px]:px-5 max-[810px]:py-[100px]">
        <div className="flex items-start gap-16 max-[810px]:flex-col max-[810px]:gap-10">
          <div className="w-full max-w-[440px]">
            {artwork.artistImage ? (
              <img className="mb-8 h-[520px] w-full object-cover" src={artwork.artistImage} alt={artwork.artistName} />
            ) : null}
            <h2 className="h4">
              {artwork.artistSlug ? <Link to={`/gallery/artists/${artwork.artistSlug}`}>{artwork.artistName}</Link> : artwork.artistName}
            </h2>
            {artwork.artistAge ? <p className="b5 mt-2 text-white">{artwork.artistAge}</p> : null}
            <div className="mt-6">
              <TextLink href={artwork.contactLink} color="white">CONTACT ARTIST</TextLink>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-16 max-[810px]:grid-cols-1 max-[810px]:gap-10">
            <div>
              <h3 className="h4">Biography</h3>
              <p className="b4 mt-6 text-white">{artwork.biography}</p>
            </div>
            <div>
              <h3 className="h4">Accolades</h3>
              <p className="b4 mt-6 text-white">{artwork.accolades}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-[100px]">
        <div className="flex items-end justify-between gap-10 max-[810px]:flex-col max-[810px]:items-start">
          <img className="block h-auto w-full max-w-[800px] bg-white" src={artwork.detailImage} alt="" />
          <div className="max-w-[420px]">
            <h2 className="h3 text-white">Detailed View</h2>
            <p className="b4 mt-6 text-white">{artwork.detailDescription}</p>
            <div className="mt-8">
              <TextLink href={artwork.contactLink}>BUY ART</TextLink>
            </div>
          </div>
        </div>
      </section>

      {next ? (
        <section className="flex flex-col gap-20 bg-black px-10 py-[120px] text-white max-[810px]:px-5 max-[810px]:py-[100px] max-[390px]:gap-10">
          <div>
            <h2 className="h3">Next Artwork</h2>
            <div className="mt-6">
              <TextLink href={`/gallery/${next.slug}`} color="white">View Artwork</TextLink>
            </div>
          </div>
          <Link to={`/gallery/${next.slug}`} className="block w-full max-w-[555px] max-[390px]:max-w-[670px]">
            <img className="block h-auto w-full bg-white" src={next.heroImage} alt={next.heroAlt} />
            <p className="h5 mt-4">{next.title}</p>
          </Link>
        </section>
      ) : null}
    </main>
  );
}
