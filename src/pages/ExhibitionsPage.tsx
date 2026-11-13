import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import type { Exhibition, SiteContent } from "@/types";

type Phase = "upcoming" | "ongoing" | "previous";

function phase(exhibition: Exhibition): Phase {
  const today = new Date().toISOString().slice(0, 10);
  if (exhibition.endDate && exhibition.endDate < today) return "previous";
  if (exhibition.startDate && exhibition.startDate > today) return "upcoming";
  if (exhibition.startDate) return "ongoing";
  if (exhibition.status === "current") return "ongoing";
  if (exhibition.status === "upcoming") return "upcoming";
  return "previous";
}

function dateLabel(exhibition: Exhibition) {
  const format = (value: string) => {
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  };
  if (exhibition.startDate && exhibition.endDate) return `${format(exhibition.startDate)} – ${format(exhibition.endDate)}`;
  if (exhibition.startDate) return format(exhibition.startDate);
  return "";
}

export function ExhibitionsPage() {
  const { exhibitions } = useOutletContext<SiteContent>();
  const [filter, setFilter] = useState<"all" | "ongoing" | "previous">("all");
  const upcoming = useMemo(() => exhibitions.filter((exhibition) => phase(exhibition) === "upcoming"), [exhibitions]);
  const visible = useMemo(() => {
    const rows = filter === "all" ? exhibitions : exhibitions.filter((exhibition) => phase(exhibition) === filter);
    return [...rows].sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
  }, [exhibitions, filter]);

  return (
    <main className="bg-black px-10 pt-[140px] pb-[120px] text-white max-[810px]:px-5 max-[810px]:pt-[120px] max-[810px]:pb-[100px]">
      <PageMeta title={`Exhibitions — ${siteTitle}`} description="Exhibitions at Voxartgallery." path="/exhibitions" />
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="h2 text-center text-white">Exhibitions</h1>
        {upcoming.length ? (
          <div className="mt-16 grid grid-cols-2 gap-8 max-[810px]:grid-cols-1">
            {upcoming.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} />)}
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-[640px] text-center">
            <p className="h3 text-white">No Upcoming Exhibition</p>
            <span className="mx-auto mt-4 block h-px w-16 bg-white" />
            <p className="mt-6 text-[15px] leading-7" style={{ color: "#f2f2f2" }}>There is no upcoming exhibition scheduled.</p>
            <p className="mt-3 text-[15px] leading-7" style={{ color: "#d0d0d0" }}>Visits follow the exhibition schedule.</p>
          </div>
        )}
        <div className="mt-20 border-t border-white/15 pt-10">
          <div className="flex flex-wrap gap-8 text-[13px] tracking-[0.16em] uppercase">
            {(["all", "ongoing", "previous"] as const).map((item) => (
              <button key={item} className="border-b pb-1" style={{ color: filter === item ? "#fff" : "#8a8a8a", borderColor: filter === item ? "#fff" : "transparent" }} type="button" onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
          {visible.length ? (
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-14 max-[810px]:grid-cols-1">
              {visible.map((exhibition) => <ExhibitionCard key={exhibition.id} exhibition={exhibition} />)}
            </div>
          ) : (
            <p className="mt-10 text-[15px]">No exhibitions</p>
          )}
        </div>
      </div>
    </main>
  );
}

export function ExhibitionCard({ exhibition }: { exhibition: Exhibition }) {
  const dates = dateLabel(exhibition);
  return (
    <Link className="flex flex-col gap-4 text-white" to={`/exhibitions/${exhibition.slug}`}>
      {exhibition.image ? <img className="block h-auto w-full bg-white" src={exhibition.image} alt="" /> : <span className="block min-h-48 bg-white/10" />}
      <span>
        <span className="block text-[22px]">{exhibition.title}</span>
        {dates ? <span className="mt-2 block text-[14px]" style={{ color: "#d0d0d0" }}>{dates}</span> : null}
        {exhibition.location ? <span className="mt-1 block text-[14px]" style={{ color: "#d0d0d0" }}>{exhibition.location}</span> : null}
      </span>
    </Link>
  );
}
