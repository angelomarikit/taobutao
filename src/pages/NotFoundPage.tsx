import { Link } from "react-router-dom";
import { siteTitle } from "@/data/reference";
import { PageMeta } from "@/components/SiteChrome";

export function NotFoundPage() {
  return (
    <main>
      <PageMeta
        title={`Page not found — ${siteTitle}`}
        description="The artwork you're looking for isn't on display here."
        path="/404"
      />
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-10 py-[120px] max-[390px]:flex-col">
        <img className="absolute inset-0 h-full w-full object-cover" src="/media/gallery-hero.png" alt="" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-[1] max-w-[760px] px-10 text-center max-[390px]:px-0">
          <h1 className="h2 text-white">This Room Doesn't Exist.</h1>
          <p className="b3 mt-6 text-white">
            The artwork you're looking for isn't on display here. It may have been moved to another collection, archived, or perhaps it never belonged to this exhibition. Return to the gallery and continue your exploration.
          </p>
          <Link className="b2 mt-10 inline-block text-white" to="/">Home</Link>
        </div>
      </section>
    </main>
  );
}
