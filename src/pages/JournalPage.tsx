import { Link, useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { copyText } from "@/lib/content";
import type { JournalArticle, SiteContent } from "@/types";

export function JournalPage({ articles }: { articles: JournalArticle[] }) {
  const { copy } = useOutletContext<SiteContent>();
  return (
    <main className="bg-black text-white">
      <PageMeta
        title={`Journal — ${siteTitle}`}
        description="Go behind the canvas with The Canvas Journal. Explore our latest curatorial insights, in-depth artist profiles, and behind-the-scenes exhibitions."
        path="/journal"
      />
      <section className="flex h-auto items-end px-10 py-[120px] max-[810px]:px-5 max-[810px]:pt-32 max-[810px]:pb-10">
        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-6 text-center">
          <h1 className="h2 text-white">{copyText(copy, "journal.intro.heading", "Journal")}</h1>
          <p className="b4 text-white">
            {copyText(copy, "journal.intro", "Go behind the canvas with The Canvas Journal. Explore our latest curatorial insights, in-depth artist profiles, and behind-the-scenes exhibitions.")}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-10 px-10 pt-10 pb-[120px] max-[810px]:grid-cols-1 max-[810px]:px-5 max-[810px]:pb-[100px]">
        {articles.map((article) => (
          <Link key={article.id} to={`/journal/${article.slug}`} className="flex flex-col gap-2.5">
            <img className="h-auto w-full" src={article.image} alt={article.imageAlt} />
            <p className="b5 text-white">{article.readTime}</p>
            <h2 className="h4 text-white">{article.title}</h2>
            <p className="b5 text-white">{article.excerpt}</p>
          </Link>
        ))}
        {!articles.length ? <p className="b5 text-white">No items</p> : null}
      </section>
    </main>
  );
}
