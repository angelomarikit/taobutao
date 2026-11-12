import { Link } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { siteOrigin } from "@/lib/supabase";
import type { JournalArticle } from "@/types";

export function ArticlePage({ article, next }: { article: JournalArticle; next?: JournalArticle }) {
  return (
    <main className="bg-black text-white">
      <PageMeta
        title={`${article.title} — ${siteTitle}`}
        description={article.excerpt}
        path={`/journal/${article.slug}`}
        image={article.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          author: { "@type": "Person", name: article.author },
          datePublished: article.publishedOn,
          image: article.image,
          url: `${siteOrigin()}/journal/${article.slug}`,
        }}
      />
      <section className="px-10 py-24 max-[810px]:px-5 max-[810px]:pt-32 max-[810px]:pb-10">
        <p className="b5 text-white">JOURNAL</p>
        <h1 className="h3 mt-4 max-w-[700px] text-white max-[390px]:max-w-[560px]">{article.title}</h1>
        <div className="mt-8 flex flex-wrap gap-6 text-white">
          <p className="b5">{article.role}</p>
          <p className="b5">{article.author}</p>
          <p className="b5">{article.readTime}</p>
        </div>
      </section>
      <figure className="mx-auto w-full max-w-[640px] px-10 max-[810px]:px-5">
        <img className="block h-auto w-full" src={article.image} alt={article.imageAlt} />
      </figure>
      <section className="px-10 pt-16 pb-10 max-[810px]:px-5 max-[810px]:pt-12">
        <div className="mx-auto max-w-[760px]">
          <h2 className="h3 text-white">{article.heroHeading}</h2>
          <p className="b4 mt-8 text-white">{article.excerpt}</p>
        </div>
      </section>
      <section className="px-10 pt-6 pb-24 max-[810px]:px-5 max-[810px]:pb-16">
        <div className="mx-auto max-w-[760px] space-y-6">
          {article.content.map((block) =>
            block.tag === "p" ? (
              <p key={block.text} className="b4 text-white">{block.text}</p>
            ) : (
              <h3 key={block.text} className={block.tag === "h2" ? "h4 pt-6 text-white" : "h4 pt-4 text-white"}>
                {block.text}
              </h3>
            ),
          )}
        </div>
      </section>
      {article.gallery?.length ? (
        <section className="journal-spread mx-auto w-full max-w-[1280px] px-10 pb-24 max-[810px]:px-5 max-[810px]:pb-16">
          {article.gallery.map((photo) => (
            <img key={photo.src} className="block h-auto w-full" src={photo.src} alt={photo.alt} />
          ))}
        </section>
      ) : null}
      {next ? (
        <section className="px-10 py-24 max-[810px]:px-5 max-[810px]:py-16">
          <p className="b5 text-white">JOURNAL</p>
          <h2 className="h3 mt-2 text-white">next journal</h2>
          <Link to={`/journal/${next.slug}`} className="mt-10 flex w-full max-w-[560px] flex-col gap-2.5">
            <span className="flex aspect-square w-full items-center justify-center overflow-hidden border border-white/15 bg-black">
              <img className="max-h-full max-w-full object-contain" src={next.image} alt={next.imageAlt} />
            </span>
            <p className="b5 text-white">{next.readTime}</p>
            <p className="h4 text-white">{next.title}</p>
            <p className="b5 text-white">{next.excerpt}</p>
          </Link>
        </section>
      ) : null}
    </main>
  );
}
