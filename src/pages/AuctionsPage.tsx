import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import type { Auction, SiteContent } from "@/types";

type Phase = "live" | "upcoming" | "previous";

function phase(auction: Auction): Phase {
  const today = new Date().toISOString().slice(0, 10);
  if (auction.endDate && auction.endDate < today) return "previous";
  if (auction.startDate && auction.startDate > today) return "upcoming";
  if (auction.startDate) return "live";
  if (auction.status === "live" || auction.status === "upcoming" || auction.status === "previous") return auction.status;
  return "upcoming";
}

function dateLabel(auction: Auction) {
  const format = (value: string) => {
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  };
  if (auction.startDate && auction.endDate) return `${format(auction.startDate)} – ${format(auction.endDate)}`;
  if (auction.startDate) return format(auction.startDate);
  return "";
}

const phaseLabel: Record<Phase, string> = { live: "Live auction", upcoming: "Upcoming", previous: "Previous" };

export function AuctionsPage() {
  const { auctions } = useOutletContext<SiteContent>();
  const [filter, setFilter] = useState<"all" | Phase>("all");
  const visible = useMemo(() => {
    const rows = filter === "all" ? auctions : auctions.filter((auction) => phase(auction) === filter);
    return [...rows].sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
  }, [auctions, filter]);

  return (
    <main className="bg-black px-10 pt-[140px] pb-[120px] text-white max-[810px]:px-5 max-[810px]:pt-[120px] max-[810px]:pb-[100px]">
      <PageMeta title={`Auctions — ${siteTitle}`} description="Auctions at Voxartgallery." path="/auctions" />
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="h2 text-center text-white">Auctions</h1>
        <div className="mt-12 flex flex-wrap gap-8 text-[13px] tracking-[0.16em] uppercase">
          {(["all", "live", "upcoming", "previous"] as const).map((item) => (
            <button key={item} className="border-b pb-1" style={{ color: filter === item ? "#fff" : "#8a8a8a", borderColor: filter === item ? "#fff" : "transparent" }} type="button" onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
        {visible.length ? (
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-14 max-[810px]:grid-cols-1">
            {visible.map((auction) => {
              const kind = phase(auction);
              return (
                <Link key={auction.id} className="flex flex-col gap-4 text-white" to={`/auctions/${auction.slug}`}>
                  {auction.image ? <img className="block h-auto w-full bg-white" src={auction.image} alt="" /> : <span className="block min-h-56 bg-white/10" />}
                  <span>
                    <span className="block text-[11px] tracking-[0.16em] uppercase" style={{ color: "#d0d0d0" }}>{phaseLabel[kind]}</span>
                    <span className="mt-2 block text-[22px]">{auction.title}</span>
                    {dateLabel(auction) ? <span className="mt-2 block text-[14px]" style={{ color: "#d0d0d0" }}>{dateLabel(auction)}</span> : null}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-16 text-center text-[18px]">No auctions</p>
        )}
      </div>
    </main>
  );
}
