import { useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useOpenContact } from "@/components/ContactDialog";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { AuctionLot, SiteContent } from "@/types";

function money(lot: AuctionLot) {
  if (lot.price == null) return "";
  try {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: lot.currency || "PHP", maximumFractionDigits: 0 }).format(lot.price);
  } catch {
    return `${lot.currency} ${lot.price}`;
  }
}

export function AuctionPage() {
  const { slug } = useParams();
  const { auctions } = useOutletContext<SiteContent>();
  const openContact = useOpenContact();
  const [query, setQuery] = useState("");
  const auction = auctions.find((item) => item.slug === slug);
  const lots = useMemo(() => {
    if (!auction) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return auction.lots;
    return auction.lots.filter((lot) => `${lot.artistName} ${lot.title}`.toLowerCase().includes(needle));
  }, [auction, query]);

  if (!auction) return <NotFoundPage />;

  return (
    <main className="bg-black px-10 pt-[140px] pb-[120px] text-white max-[810px]:px-5 max-[810px]:pt-[120px] max-[810px]:pb-[100px]">
      <PageMeta title={`${auction.title} — ${siteTitle}`} description={auction.description || auction.title} path={`/auctions/${auction.slug}`} />
      <div className="mx-auto w-full max-w-[1200px]">
        <Link className="text-[14px] text-white" to="/auctions">Auctions</Link>
        <h1 className="h2 mt-6 text-white">{auction.title}</h1>
        {auction.location ? <p className="mt-4 text-[15px]" style={{ color: "#d0d0d0" }}>{auction.location}</p> : null}
        {auction.description ? <p className="mt-4 max-w-[720px] text-[16px] leading-7">{auction.description}</p> : null}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] tracking-[0.16em] uppercase">{lots.length} {lots.length === 1 ? "lot" : "lots"}</p>
          <input
            className="h-11 w-full max-w-sm border border-white/25 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-neutral-500"
            placeholder="Search artist or artwork"
            aria-label="Search artist or artwork"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {lots.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-14 max-[810px]:grid-cols-1">
            {lots.map((lot) => {
              const amount = money(lot);
              return (
                <article key={lot.id} className="flex flex-col gap-4">
                  {lot.image ? <img className="block h-auto w-full bg-white" src={lot.image} alt="" /> : <span className="block min-h-56 bg-white/10" />}
                  <div>
                    <p className="text-[12px] tracking-[0.14em] uppercase" style={{ color: "#d0d0d0" }}>Lot {lot.lotNumber}</p>
                    {lot.artistName ? <p className="mt-2 text-[18px]">{lot.artistName}</p> : null}
                    <p className="mt-1 text-[16px]">{lot.title}</p>
                    {amount ? <p className="mt-3 text-[16px]">{amount}</p> : null}
                    <button
                      className="mt-4 border border-white px-4 py-2 text-[14px]"
                      type="button"
                      onClick={() => openContact(`I would like to place a bid on Lot ${lot.lotNumber}, ${lot.title}${lot.artistName ? ` by ${lot.artistName}` : ""}, in ${auction.title}.`)}
                    >
                      Place bid
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-[15px]">No lots</p>
        )}
      </div>
    </main>
  );
}
