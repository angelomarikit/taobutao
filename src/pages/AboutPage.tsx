import { useOutletContext } from "react-router-dom";
import { PageMeta } from "@/components/SiteChrome";
import { Newsletter } from "@/components/Newsletter";
import { siteTitle, socialLinks } from "@/data/reference";
import { copyBlocks, copyText } from "@/lib/content";
import type { SiteContent } from "@/types";

const defaultPhotographs = [
  { src: "/media/about-bettina-2.jpg", alt: "Guests outside Arte Bettina at the Blueprint opening" },
  { src: "/media/about-black-pair.jpg", alt: "TAO BUTAO with a guest beside two black reliefs" },
  { src: "/media/about-visit.png", alt: "TAO BUTAO with guests in a gallery" },
  { src: "/media/about-opening.jpg", alt: "TAO BUTAO with guests at an opening" },
  { src: "/media/blueprint-cover.jpg", alt: "TAO BUTAO in front of red, gold, and blue reliefs" },
  { src: "/media/resilience-gold.png", alt: "Gold and black reliefs from Resilience" },
];

export function AboutPage() {
  const { copy } = useOutletContext<SiteContent>();
  const text = (key: string, fallback: string) => copyText(copy, key, fallback);
  const work = copyBlocks(copy, "about.work", "‘Resilience’ by Tao Butao transforms metal, often seen as rigid and unyielding, into a profound exploration of struggle, endurance, and renewal. Each crumpled fold becomes a narrative of tension and release, embracing imperfection as a testament to transformation. The reflective surfaces capture the delicate balance between strength and fragility.\n\nInstead of imitating life and its figurative forms, TAO Butao makes use of inanimate objects and crumples them into unpredictable folds— an echo of the volatility and uncertainty of reality, a vital component of life itself. As a whole, Blueprint is a series of works that resonate with existence itself at its base nature.\n\nText by Melissa Uy");
  const resilience = copyBlocks(copy, "about.resilience.heading", "Solo exhibit\n\n‘Resilience’");
  const resilienceBody = copyBlocks(copy, "about.resilience", "01.23.25 – 02.09.25\n\nArt Anton, G/F, S Maison at Conrad, Marina Way, MOA Complex, 1300 Pasay City, PH");
  const blueprint = copyBlocks(copy, "about.blueprint.heading", "Solo show\n\nBlueprint");
  const blueprintBody = copyBlocks(copy, "about.blueprint", "Arte Bettina\n\nGuest of honor Luis E. Yee, Jr., better known as Junyee.");
  const photographs = defaultPhotographs.map((photo, index) => ({
    src: text(`about.photo-${index + 1}.image`, photo.src),
    alt: text(`about.photo-${index + 1}.heading`, photo.alt),
  }));
  const socials = [
    { label: "Instagram", href: text("settings.instagram_url", socialLinks[0].href) },
    { label: "Facebook", href: text("settings.facebook_url", socialLinks[1].href) },
  ];
  return (
    <main className="bg-black text-white">
      <PageMeta
        title={`About — ${siteTitle}`}
        description="TAO BUTAO crumples metal into reliefs. Solo exhibitions include Resilience at Art Anton and Blueprint at Arte Bettina."
        path="/about"
      />

      <section className="px-10 pt-40 pb-16 max-[810px]:px-5 max-[810px]:pt-[140px]">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-16">
          <div className="flex items-end justify-between gap-16 max-[810px]:flex-col max-[810px]:items-start max-[810px]:gap-8">
            <h1 className="h2 max-w-[900px] text-white">{text("about.hero.heading", "TAO BUTAO")}</h1>
            <p className="b4 max-w-[440px] text-right text-white max-[810px]:text-left">
              {text("about.hero", "Metal, crumpled into folds. Strength shaped by the marks of pressure, time, and transformation.")}
            </p>
          </div>
          <img
            className="block h-auto w-full"
            src={text("about.hero.image", "/media/about-black-reliefs.jpg")}
            alt={text("about.hero.link", "TAO BUTAO beside two black reliefs")}
          />
        </div>
      </section>

      <section className="px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-[100px]">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start gap-20 max-[810px]:grid-cols-1 max-[810px]:gap-10">
          <p className="label text-white">{text("about.work.heading", "The work")}</p>
          <div className="b4 max-w-[760px] space-y-6 text-white">
            {work.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="px-10 pb-[120px] max-[810px]:px-5 max-[810px]:pb-[100px]">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-2 items-start gap-10 max-[810px]:grid-cols-1">
          <article className="flex flex-col gap-6">
            <img className="block h-auto w-full" src={text("about.resilience.image", "/media/resilience-journal.jpg")} alt="Resilience exhibition poster for TAO BUTAO" />
            <div>
              <p className="label text-white">{resilience[0]}</p>
              <h2 className="h4 mt-3 text-white">{resilience[1]}</h2>
              <p className="b5 mt-4 text-white">{resilienceBody[0]}</p>
              <p className="b5 mt-2 max-w-[420px] text-white">{resilienceBody[1]}</p>
            </div>
          </article>
          <article className="flex flex-col gap-6">
            <img className="block h-auto w-full" src={text("about.blueprint.image", "/media/about-bettina-1.jpg")} alt="TAO BUTAO with guests outside Arte Bettina at the Blueprint opening" />
            <div>
              <p className="label text-white">{blueprint[0]}</p>
              <h2 className="h4 mt-3 text-white">{blueprint[1]}</h2>
              <p className="b5 mt-4 text-white">{blueprintBody[0]}</p>
              <p className="b5 mt-2 max-w-[420px] text-white">{blueprintBody[1]}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-10 pb-[120px] max-[810px]:px-5 max-[810px]:pb-[100px]">
        <div className="mx-auto grid w-full max-w-[1800px] grid-cols-3 items-start gap-8 max-[810px]:grid-cols-1">
          {photographs.map((photo) => (
            <img key={photo.src} className="block h-auto w-full" src={photo.src} alt={photo.alt} />
          ))}
        </div>
      </section>

      <section className="px-10 pb-[120px] max-[810px]:px-5 max-[810px]:pb-[100px]">
        <div className="mx-auto flex w-full max-w-[1800px] items-start justify-between gap-10 max-[810px]:flex-col">
          <p className="label text-white">Find the work</p>
          <ul className="space-y-3">
            {socials.map((link) => (
              <li key={link.href}>
                <a className="h4 text-white" href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <video
        className="block h-auto w-full bg-black"
        src={text("about.showreel.image", "/media/showreel.mp4")}
        muted
        loop
        playsInline
        autoPlay
      />
      <Newsletter />
    </main>
  );
}
