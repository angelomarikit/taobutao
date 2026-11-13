import { Link, useOutletContext, useParams } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { SiteContent } from "@/types";

export function ExhibitionPage() {
  const { slug } = useParams();
  const { exhibitions } = useOutletContext<SiteContent>();
  const exhibition = exhibitions.find((item) => item.slug === slug);
  if (!exhibition) return <NotFoundPage />;

  return (
    <main className="bg-black px-10 pt-[140px] pb-[120px] text-white max-[810px]:px-5 max-[810px]:pt-[120px] max-[810px]:pb-[100px]">
      <PageMeta title={`${exhibition.title} — ${siteTitle}`} description={exhibition.description || exhibition.title} path={`/exhibitions/${exhibition.slug}`} />
      <div className="mx-auto w-full max-w-[1100px]">
        <Link className="text-[14px] text-white" to="/exhibitions">Exhibitions</Link>
        <h1 className="h2 mt-6 text-white">{exhibition.title}</h1>
        {exhibition.location ? <p className="mt-4 text-[15px]" style={{ color: "#d0d0d0" }}>{exhibition.location}</p> : null}
        {exhibition.description ? <p className="mt-6 max-w-[720px] text-[16px] leading-7">{exhibition.description}</p> : null}
        {exhibition.image ? <img className="mt-10 block h-auto w-full bg-white" src={exhibition.image} alt={exhibition.imageAlt || exhibition.title} /> : null}
      </div>
    </main>
  );
}
