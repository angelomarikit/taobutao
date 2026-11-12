import { Link } from "react-router-dom";
import { ArrowLink, PageMeta, TextLink } from "@/components/SiteChrome";
import { Newsletter } from "@/components/Newsletter";
import { Reveal, useInView } from "@/components/Reveal";
import { copyBlocks, copyText } from "@/lib/content";
import { galleryLockup, siteTitle } from "@/data/reference";
import type { Artwork, Exhibition, JournalArticle } from "@/types";

function GallerySlide({ title, href, image }: { title: string; href: string; image: string }) {
  return (
    <article
      className="relative flex h-screen w-full flex-col justify-end bg-cover bg-center px-10 pb-5 max-[810px]:px-5"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${image})` }}
    >
      <div className="flex items-end justify-between gap-6 max-[810px]:flex-col max-[810px]:items-start">
        <div className="flex flex-col items-start gap-5">
          <h3 className="h4 text-white">{title}</h3>
          <ArrowLink href={href}>View Artwork</ArrowLink>
        </div>
        <ArrowLink href="/gallery">Visit Gallery</ArrowLink>
      </div>
    </article>
  );
}

function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link to={`/journal/${article.slug}`} className="flex h-auto w-full flex-col gap-2.5">
      <span className="flex aspect-square w-full items-center justify-center overflow-hidden border border-white/15 bg-black">
        <img className="max-h-full max-w-full object-contain" src={article.image} alt={article.imageAlt} />
      </span>
      <p className="b5 text-white">{article.readTime}</p>
      <h3 className="h4 text-white">{article.title}</h3>
    </Link>
  );
}

function Unroll({ src, alt, align }: { src: string; alt: string; align: "start" | "center" | "end" }) {
  const { ref, inView } = useInView<HTMLDivElement>(align === "center" ? 0.5 : 0.2);
  return (
    <div className={`flex w-full ${align === "center" ? "justify-center" : align === "end" ? "justify-end" : "justify-start"}`}>
      <div ref={ref} className={`unroll-frame ${inView ? "is-in" : ""}`}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}

function ScrollVideo({ src }: { src: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.45);
  return (
    <section className="bg-black">
      <div ref={ref} className="sticky top-0 z-[1]">
        <video
          className="h-screen w-full bg-black object-cover transition-transform duration-700"
          style={{ transform: `scale(${inView ? 1 : 0.4})` }}
          src={src}
          muted
          loop
          playsInline
          autoPlay
        />
      </div>
      <div className="h-screen max-[390px]:h-[40vh]" />
    </section>
  );
}

export function HomePage({
  artworks,
  articles,
  exhibitions,
  copy,
}: {
  artworks: Artwork[];
  articles: JournalArticle[];
  exhibitions: Exhibition[];
  copy?: Record<string, string>;
}) {
  const hasWorks = artworks.length > 0;
  const resilience = articles.find((article) => article.slug === "resilience");
  const blueprint = articles.find((article) => article.slug === "blueprint");
  const text = (key: string, fallback: string) => copyText(copy, key, fallback);
  const heroTitle = text("home.hero.heading", galleryLockup);
  const heroCaption = text("home.hero", "Resilience\nby TAO BUTAO\n1.23.25");
  const onView = copyBlocks(copy, "home.onview", "‘Resilience’\n\nA Solo Exhibition by TAO BUTAO\n\nTAO BUTAO’s ‘Resilience’ transforms the inherent rigidity of metal into a contemplative exploration of struggle, endurance, and transformation. Each crumpled surface becomes a narrative of tension and release, a dialogue between force and surrender. Through Tao’s process, metal—a material often associated with strength and permanence—is reimagined as pliable, vulnerable, and deeply evocative. The folds and creases, simultaneously chaotic and deliberate, serve as metaphors for resilience, capturing the moments where destruction transitions into renewal, and where imperfection becomes a source of beauty.\n\n23 Jan — 09 Feb 2025 · @tao_butao");
  const figures = text("home.stats", "126 | UNIQUE ART WORKS\n38 | FEATURED ARTIST\n24 | YEARS OF EXCELLENCE")
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts[0] && parts[1]);
  const selected = copyBlocks(copy, "home.selected", "SELECTED arts\n\nA curated selection from recent collections  paintings, sculpture, photography, and installation by represented artists.");
  const eventHeading = copyBlocks(copy, "home.events.heading", "CALENDAR\n\nUPCOMING EVENTS");
  const eventLink = copyBlocks(copy, "home.events.link", "BOOK YOUR TICKET NOW\n\nmailto:tommydreamchaser@gmail.com");
  const journalHeading = copyBlocks(copy, "home.journal.heading", "JOURNAL\n\nPERSPECTIVES");
  const visits = [
    ["visit-1", "/media/visit-1.jpg", "Two visitors with a red relief and a black relief", "start"],
    ["visit-2", "/media/visit-2.jpg", "Visitors looking at a black relief in the gallery", "center"],
    ["visit-3", "/media/visit-3.jpg", "A group standing in the gallery beside the black relief", "end"],
  ] as const;

  return (
    <main>
      <PageMeta
        title={siteTitle}
        description="Resilience by TAO BUTAO, 1.23.25."
        path="/"
        image="/media/hero-banner.png"
      />

      <section className="relative bg-black">
        <img
          className="block h-auto w-full max-[810px]:h-[100svh] max-[810px]:object-cover max-[810px]:object-[58%_center]"
          src={text("home.hero-media.image", "/media/hero-banner.png")}
          alt={text("home.hero-media.heading", "Two copper relief works installed in a gallery corner")}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 22%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.72) 100%)",
          }}
        />
        <div className="hero-copy absolute inset-0 z-[4] flex flex-col justify-between px-10 pt-[120px] pb-5 max-[810px]:px-5 max-[810px]:pt-28 max-[810px]:pb-8">
          <p className="b5 ml-auto max-w-[280px] text-right text-white max-[810px]:ml-0 max-[810px]:text-left">
            {heroCaption.split("\n").map((line, index) => (
              <span key={line}>{index ? <br /> : null}{line}</span>
            ))}
          </p>
          <Reveal y={40} duration={0.6} delay={0.2} threshold={0.5}>
            <h1 className="h1 text-white">
              {heroTitle.split("\n").map((line, index) => (
                <span key={line}>{index ? <br /> : null}{line}</span>
              ))}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-black px-10 py-[100px] max-[810px]:px-5">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-16">
          <div className="flex items-start justify-between gap-[313px] max-[810px]:flex-col max-[810px]:gap-8">
            <Reveal y={40} duration={0.6} delay={0.2} threshold={0.5} className="flex w-full max-w-[440px] items-start justify-between max-[810px]:max-w-[360px]">
              <p className="b5 text-white">{text("home.about-year.heading", "2026")}</p>
              <h2 className="h3 text-white">{text("home.about-intro.heading", "ABOUT US")}</h2>
            </Reveal>
            <p className="b4 max-w-[440px] text-white max-[810px]:max-w-[360px]">
              {text("home.about-intro", "Founded with a commitment to supporting emerging and established artists, the gallery creates meaningful connections between art, culture, and community.")}
            </p>
          </div>

          <div className="flex items-start gap-10 max-[810px]:flex-col">
            <Reveal scale={1.03} y={0} duration={0.9} delay={0.08} ease="cubic-bezier(0.16, 1, 0.3, 1)" className="flex w-full flex-col gap-[176px] max-[810px]:gap-10">
              <img className="h-[660px] w-full object-cover object-center max-[810px]:h-auto" src={text("home.about-photo.image", "/media/resilience.jpg")} alt={text("home.about-photo.heading", "Resilience by TAO BUTAO, 1.23.25")} />
              <div className="flex flex-col items-start gap-5">
                <p className="h4 text-white">{text("home.about-photo", "COME SEE US")}</p>
                <TextLink href={text("home.about-photo.link", exhibitions[0]?.link || "mailto:tommydreamchaser@gmail.com")}>BOOK TICKET</TextLink>
              </div>
            </Reveal>
            <Reveal y={20} duration={0.85} delay={0.16} ease="cubic-bezier(0.16, 1, 0.3, 1)" className="flex w-full flex-col gap-16 max-[810px]:gap-10">
              <div className="flex w-full flex-col gap-[22px]">
                {figures.map(([count, label]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      <p className="h4 text-white">{count}</p>
                      <p className="b6 text-white">{label}</p>
                    </div>
                    <div className="mt-[22px] h-px bg-white/40" />
                  </div>
                ))}
              </div>
              <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <p className="b5 text-white">{text("home.onview.heading", "On View")}</p>
                  <p className="b2 text-white">{onView[0]}</p>
                  <p className="b4 text-white">{onView[1]}</p>
                  <p className="b4 text-white">{onView[2]}</p>
                  <p className="b5 text-white">{onView[3]}</p>
                </div>
                <img className="h-[520px] w-full object-cover object-center max-[810px]:h-auto" src={text("home.onview-image.image", "/media/resilience-gold.png")} alt={text("home.onview-image.heading", "Resilience, a solo exhibition by TAO BUTAO")} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="flex items-start justify-between gap-[408px] px-10 pt-[120px] max-[810px]:flex-col max-[810px]:gap-8 max-[810px]:px-5 max-[810px]:pt-16">
          <div className="max-w-[440px]">
            <p className="b5 text-white">{text("home.selected.heading", "(20)")}</p>
            <h2 className="h3 mt-2.5 text-white">{selected[0]}</h2>
          </div>
          <p className="b3 max-w-[440px] text-left text-white">{selected[1]}</p>
        </div>
        <div className="mt-16">
          {hasWorks ? (
            <GallerySlide title={text("home.selected-slide.heading", "White Horizon")} href={text("home.selected-slide.link", "/gallery")} image={text("home.selected-slide.image", "/media/resilience-trio.jpg")} />
          ) : (
            <p className="b5 px-10 text-[rgb(153,153,153)]">No items</p>
          )}
        </div>
      </section>

      <section className="bg-black">
        <div className="sticky top-0 z-[1] flex flex-col gap-20 px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-20 max-[390px]:px-5 max-[390px]:py-0">
          {visits.map(([key, src, alt, align]) => (
            <Unroll key={key} src={text(`home.${key}.image`, src)} alt={text(`home.${key}.heading`, alt)} align={align} />
          ))}
        </div>
      </section>

      <ScrollVideo src={text("home.showreel.image", "/media/showreel.mp4")} />

      <section className="bg-black px-10 py-[120px] text-white max-[810px]:px-5 max-[810px]:py-[100px]">
        <div className="mx-auto flex w-full max-w-[1800px] items-start justify-between gap-[135px] max-[810px]:flex-col max-[810px]:gap-10">
          <div className="flex w-full max-w-[640px] flex-col gap-10">
            <div>
              <p className="b6 text-white">{eventHeading[0]}</p>
              <h2 className="h3 mt-2.5 text-white">{eventHeading[1]}</h2>
            </div>
            <video
              className="block h-auto w-full bg-black"
              src={text("home.events.image", "/media/events-clip.mp4")}
              muted
              loop
              playsInline
              autoPlay
            />
          </div>
          <div className="flex w-full max-w-[670px] flex-col items-start gap-8 max-[810px]:max-w-none">
            <p className="h4 text-white">{text("home.events", "Wait for scheduled events")}</p>
            <TextLink href={eventLink[1] || "mailto:tommydreamchaser@gmail.com"}>{eventLink[0] || "BOOK YOUR TICKET NOW"}</TextLink>
          </div>
        </div>
      </section>

      <section className="bg-black px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-[100px]">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-16 max-[390px]:gap-10">
          <div className="flex items-end justify-between gap-[408px] max-[810px]:flex-col max-[810px]:items-start max-[810px]:gap-6">
            <div className="max-w-[440px]">
              <p className="b5 text-white">{journalHeading[0]}</p>
              <h2 className="h3 mt-2.5 text-white">{journalHeading[1]}</h2>
            </div>
            <p className="b4 text-right text-white max-[810px]:text-left">
              {text("home.journal", "Stories, essays, and reflections from artists and curators.")}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 items-start gap-10 max-[810px]:grid-cols-1 max-[810px]:gap-16">
            {resilience ? <JournalCard article={resilience} /> : null}
            {blueprint ? <JournalCard article={blueprint} /> : null}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
