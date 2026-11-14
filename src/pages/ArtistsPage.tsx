import { useMemo, useState, type FormEvent } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { siteTitle } from "@/data/reference";
import { useLanguage } from "@/lib/language";
import type { SiteContent } from "@/types";

export function ArtistsPage() {
  const { artists } = useOutletContext<SiteContent>();
  const { t } = useLanguage();
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");

  const visible = useMemo(() => {
    const needle = name.trim().toLowerCase();
    return [...artists]
      .filter((artist) => !needle || artist.name.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [artists, name]);

  function apply(event: FormEvent) {
    event.preventDefault();
    setName(draft);
  }

  return (
    <main className="bg-black px-10 pt-[140px] pb-[120px] text-white max-[810px]:px-5 max-[810px]:pt-[120px] max-[810px]:pb-[100px]">
      <PageMeta title={`All Artists — ${siteTitle}`} description="Artists represented by Voxartgallery." path="/gallery/artists" />
      <div className="mx-auto w-full max-w-[1100px]">
        <h1 className="h2 text-center text-white">{t("allArtists")}</h1>
        <form className="mx-auto mt-12 flex max-w-[720px] items-center gap-3 max-[810px]:flex-col" onSubmit={apply}>
          <input
            className="h-12 w-full border border-white/25 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-neutral-500"
            placeholder={t("byName")}
            value={draft}
            aria-label={t("byName")}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button className="h-12 shrink-0 bg-white px-10 text-[15px] font-medium max-[810px]:w-full" style={{ color: "#111" }} type="submit">
            {t("filter")}
          </button>
        </form>
        {visible.length ? (
          <ul className="mt-14 grid grid-cols-3 items-start gap-x-8 gap-y-12 max-[810px]:grid-cols-1">
            {visible.map((artist) => (
              <li key={artist.id}>
                <Link className="flex flex-col gap-4 text-white" to={`/gallery/artists/${artist.slug}`}>
                  {artist.image ? (
                    <img className="block h-auto w-full bg-white" src={artist.image} alt="" />
                  ) : (
                    <span className="block min-h-40 bg-white/10" />
                  )}
                  <span className="text-[18px]">{artist.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-14 text-[15px] text-white">{t("noArtists")}</p>
        )}
      </div>
    </main>
  );
}
