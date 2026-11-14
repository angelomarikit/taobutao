import { useEffect, useId, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { useOpenContact } from "@/components/ContactDialog";
import { contactMailto, galleryName, socialLinks } from "@/data/reference";
import { footerFields } from "@/data/footer";
import { copyText } from "@/lib/content";
import { languages, useLanguage } from "@/lib/language";
import { siteOrigin } from "@/lib/supabase";
import type { Artist, Artwork, Exhibition, JournalArticle } from "@/types";

function publicSocials(copy?: Record<string, string>) {
  return [
    { label: "Instagram", href: copyText(copy, "settings.instagram_url", socialLinks[0].href) },
    { label: "Facebook", href: copyText(copy, "settings.facebook_url", socialLinks[1].href) },
    { label: "WhatsApp", href: copyText(copy, "settings.whatsapp_url", "https://wa.me/639568226826") },
    { label: "Viber", href: copyText(copy, "settings.viber_url", "viber://chat?number=%2B639568226826") },
  ];
}

export function Navigation({
  artists = [],
  artworks = [],
  articles = [],
  exhibitions = [],
}: {
  copy?: Record<string, string>;
  artists?: Artist[];
  artworks?: Artwork[];
  articles?: JournalArticle[];
  exhibitions?: Exhibition[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t } = useLanguage();
  const location = useLocation();
  const path = location.pathname;
  const artistHere = path.startsWith("/gallery/artists");
  const artworksHere = path === "/gallery" || (path.startsWith("/gallery/") && !path.startsWith("/gallery/artists") && !path.startsWith("/gallery/collections"));
  const auctionHere = path.startsWith("/auctions");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const found: { label: string; hint: string; to: string }[] = [];
    for (const artist of artists) {
      if (artist.name.toLowerCase().includes(needle)) found.push({ label: artist.name, hint: t("hintArtist"), to: `/gallery/artists/${artist.slug}` });
    }
    for (const artwork of artworks) {
      if (`${artwork.title} ${artwork.artistName}`.toLowerCase().includes(needle)) found.push({ label: artwork.title, hint: artwork.artistName || t("hintWork"), to: `/gallery/${artwork.slug}` });
    }
    for (const exhibition of exhibitions) {
      if (exhibition.title.toLowerCase().includes(needle)) found.push({ label: exhibition.title, hint: t("hintExhibition"), to: `/exhibitions/${exhibition.slug}` });
    }
    for (const article of articles) {
      if (article.title.toLowerCase().includes(needle)) found.push({ label: article.title, hint: t("hintStory"), to: `/journal/${article.slug}` });
    }
    return found.slice(0, 8);
  }, [articles, artists, artworks, exhibitions, query, t]);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[8] bg-black text-white">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-5 min-[1100px]:px-10">
          <button type="button" className="grid h-11 w-11 place-items-center justify-self-start" aria-label={t("openMenu")} aria-expanded={open} onClick={() => setOpen(true)}>
            <span className="flex w-[22px] flex-col gap-[5px]">
              <span className="h-px bg-white" />
              <span className="h-px bg-white" />
              <span className="h-px bg-white" />
            </span>
          </button>
          <Link to="/" className="grid justify-items-center text-white" aria-label={galleryName}>
            <BrandMark className="h-8 min-[1100px]:h-10" />
            <span className="mt-1 text-[9px] tracking-[0.18em] whitespace-nowrap min-[1100px]:text-[11px] min-[1100px]:tracking-[0.28em]" style={{ fontFamily: "Inter, sans-serif", color: "#fff" }}>FINE ARTS AT AUCTION</span>
          </Link>
          <div className="flex items-center justify-self-end">
            <LanguageMenu />
            <Link to="/admin" className="grid h-11 w-11 place-items-center" aria-label={t("signIn")} style={{ color: "#fff" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.7" />
                <path d="M5.2 19.4c1.5-3.2 3.8-4.6 6.8-4.6s5.3 1.4 6.8 4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className={`site-menu-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`site-menu ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open} style={{ color: "#1c1c1c" }}>
        <div className="flex items-center justify-between px-6 pt-6">
          <Link to="/" aria-label={galleryName} onClick={() => setOpen(false)}>
            <BrandMark className="h-9" />
          </Link>
          <button type="button" className="grid h-10 w-10 place-items-center text-[28px] leading-none" style={{ color: "#1c1c1c" }} aria-label={t("closeMenu")} onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <div className="px-6 pt-4">
          <label className="flex items-center gap-2 rounded-md border px-3 py-2" style={{ borderColor: "#d9d9d9" }}>
            <span className="sr-only">{t("search")}</span>
            <input
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "#1c1c1c" }}
              placeholder={t("search")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="#1c1c1c" strokeWidth="1.4">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 14 14" />
            </svg>
          </label>
          {query.trim() ? (
            <div className="mt-2 max-h-40 overflow-y-auto border" style={{ borderColor: "#ececec" }}>
              {results.length ? results.map((result) => (
                <Link key={`${result.to}-${result.label}`} className="block px-3 py-2 text-sm" style={{ color: "#1c1c1c" }} to={result.to}>
                  <span className="block">{result.label}</span>
                  <span className="text-xs" style={{ color: "#8a8a8a" }}>{result.hint}</span>
                </Link>
              )) : <p className="px-3 py-2 text-sm" style={{ color: "#8a8a8a" }}>{t("noResults")}</p>}
            </div>
          ) : null}
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto pb-4">
          <MenuLink to="/" active={path === "/"}>{t("home")}</MenuLink>
          <MenuLink to="/auctions" active={auctionHere}>{t("auctions")}</MenuLink>
          <MenuLink to="/exhibitions" active={path.startsWith("/exhibitions")}>{t("exhibition")}</MenuLink>
          <MenuLink to="/gallery/artists" active={artistHere}>{t("artist")}</MenuLink>
          <MenuLink to="/gallery" active={artworksHere}>{t("artworks")}</MenuLink>
        </nav>
        <div className="px-6 pt-4 pb-6">
          <Link className="block py-3 text-center text-sm font-medium" style={{ background: "#111", color: "#fff" }} to="/admin">{t("signInButton")}</Link>
        </div>
      </aside>
    </>
  );
}

function LanguageMenu() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = languages.find((item) => item.id === language) ?? languages[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const root = document.getElementById("language-menu");
      if (root && event.target instanceof Node && !root.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div id="language-menu" className="relative">
      <button
        type="button"
        className="flex h-11 items-center gap-1 px-2 text-[13px] tracking-[0.12em]"
        style={{ color: "#fff", fontFamily: "Inter, sans-serif" }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        {current.code}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-20 min-w-36 border border-white/15 bg-black py-1" role="listbox" aria-label={t("language")}>
          {languages.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === language}
              className="block w-full px-4 py-2 text-left text-[13px] tracking-[0.08em]"
              style={{ color: item.id === language ? "#fff" : "#bdbdbd", fontFamily: "Inter, sans-serif" }}
              onClick={() => {
                setLanguage(item.id);
                setOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ to, active, children }: { to: string; active: boolean; children: string }) {
  return (
    <Link className="block px-6 py-3 text-[13px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#1c1c1c", background: active ? "#ededed" : "transparent" }} to={to}>
      {children}
    </Link>
  );
}

const exploreRoutes = [
  ["footer_link_auctions", "/auctions"],
  ["footer_link_exhibitions", "/exhibitions"],
  ["footer_link_artists", "/gallery/artists"],
  ["footer_link_stories", "/journal"],
  ["footer_link_galleries", "/gallery"],
] as const;

const serviceKeys = ["footer_link_buy", "footer_link_sell", "footer_link_estimate", "footer_link_contact"] as const;

export function Footer({ copy }: { copy?: Record<string, string> }) {
  const openContact = useOpenContact();
  function field(key: string) {
    const found = footerFields.find((item) => item.key === key);
    return copyText(copy, `settings.${key}`, found?.fallback ?? "");
  }
  const email = field("contact_email").replace(/^mailto:/, "");
  const mailValue = field("contact_mailto").trim();
  const mailto = mailValue.startsWith("mailto:") ? mailValue : `mailto:${mailValue || email || contactMailto.replace(/^mailto:/, "")}`;
  const phone = field("contact_phone");
  const address = field("gallery_address");
  const hours = field("visit_hours").split("\n").map((line) => line.trim()).filter(Boolean);
  const intro = field("footer_tagline");
  const socials = publicSocials(copy);
  const labelStyle = { color: "#d0d0d0" };
  const linkStyle = { color: "#fff" };

  function socialRow() {
    return (
      <div className="flex gap-4">
        {socials.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="grid h-9 w-9 place-items-center">
            <SocialIcon label={link.label} />
          </a>
        ))}
      </div>
    );
  }

  function exploreList() {
    return (
      <ul className="mt-5 space-y-3 text-[15px]">
        {exploreRoutes.map(([key, to]) => (
          <li key={key}><Link style={linkStyle} to={to}>{field(key)}</Link></li>
        ))}
      </ul>
    );
  }

  function servicesList() {
    return (
      <ul className="mt-5 space-y-3 text-[15px]">
        {serviceKeys.map((key) => (
          <li key={key}>
            <button className="cursor-pointer border-0 bg-transparent p-0 text-left" style={linkStyle} type="button" onClick={() => openContact()}>{field(key)}</button>
          </li>
        ))}
        <li><Link style={linkStyle} to="/about">{field("footer_link_faq")}</Link></li>
        <li><Link style={linkStyle} to="/about">{field("footer_link_about")}</Link></li>
      </ul>
    );
  }

  function addressBlock() {
    return (
      <>
        {address.split("\n").map((line) => <p key={line} className="mt-1">{line}</p>)}
        {phone ? <p className="mt-1">{phone}</p> : null}
      </>
    );
  }

  return (
    <footer className="bg-black px-8 pt-16 pb-8 text-white max-[810px]:px-5 min-[1100px]:px-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="min-[1100px]:hidden">
        <Link to="/" aria-label={galleryName} className="mb-8 inline-block text-white">
          <BrandMark className="h-12" />
        </Link>
        <p className="max-w-[760px] text-[15px] leading-7" style={{ color: "#f2f2f2" }}>
          {intro}
        </p>
        <div className="mt-8">{socialRow()}</div>
        <div className="mt-14 grid max-w-[640px] grid-cols-2 gap-x-16 gap-y-10 max-[390px]:grid-cols-1">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_explore_label")}</p>
            {exploreList()}
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_services_label")}</p>
            {servicesList()}
          </div>
        </div>
        <div className="mt-16 max-w-[360px] space-y-8 text-[15px] leading-7">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_visit_label")}</p>
            {addressBlock()}
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_enquiries_label")}</p>
            <p className="mt-1"><a style={linkStyle} href={mailto}>{email}</a></p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_hours_label")}</p>
            {hours.map((line) => <p key={line} className="mt-1">{line}</p>)}
          </div>
        </div>
      </div>

      <div className="hidden items-start gap-x-12 min-[1100px]:grid min-[1100px]:grid-cols-[minmax(280px,1.35fr)_minmax(140px,0.7fr)_minmax(160px,0.75fr)_minmax(220px,0.95fr)]">
        <div>
          <Link to="/" aria-label={galleryName} className="inline-block text-white">
            <BrandMark className="h-14" />
          </Link>
          <p className="mt-6 max-w-[420px] text-[15px] leading-7" style={{ color: "#f2f2f2" }}>{intro}</p>
          <div className="mt-8">{socialRow()}</div>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_explore_label")}</p>
          {exploreList()}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_services_label")}</p>
          {servicesList()}
        </div>
        <div className="text-[15px] leading-7">
          <p className="text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_client_label")}</p>
          <div className="mt-5">{addressBlock()}</div>
          <p className="mt-6 text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_enquiries_label")}</p>
          <p className="mt-2"><a style={linkStyle} href={mailto}>{email}</a></p>
          <p className="mt-6 text-[11px] tracking-[0.22em] uppercase" style={labelStyle}>{field("footer_hours_label")}</p>
          {hours.map((line) => <p key={line} className="mt-2">{line}</p>)}
        </div>
      </div>

      <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/20 pt-5 pr-40 text-[13px]">
        <p>{field("footer_copyright")}</p>
        <p>{field("footer_credit")}</p>
      </div>
    </footer>
  );
}

function SocialIcon({ label }: { label: string }) {
  if (label === "Facebook") return <FacebookIcon />;
  if (label === "WhatsApp") return <WhatsAppIcon />;
  if (label === "Viber") return <ViberIcon />;
  return <InstagramIcon />;
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path fill="#fff" d="M13.2 18.5v-5.1h1.7l.3-1.9h-2v-1.2c0-.6.2-.9 1-.9h1V7.6c-.2 0-.8-.1-1.5-.1-1.5 0-2.6.9-2.6 2.6v1.4H9.4v1.9h1.7v5.1h2.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  const id = useId().replace(/:/g, "");
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f9ce34" />
          <stop offset="0.45" stopColor="#ee2a7b" />
          <stop offset="1" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill={`url(#${id})`} />
      <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.7" cy="7.3" r="1" fill="#fff" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path fill="#fff" d="M16.7 14.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1l-.5.6c-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.4c.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.3 1.4.6 1.7.6 2.3.5.4-.1 1.3-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#7360F2" />
      <path fill="#fff" d="M8.2 7.6c.3-1.2 1.6-1.1 2.3-.4.3.3.6.8.8 1.2.2.5 0 .9-.3 1.2l-.5.4c.5.9 1.2 1.6 2.1 2.1l.4-.5c.3-.3.7-.5 1.2-.3.4.2.9.5 1.2.8.7.7.8 2 .4 2.3-1.1.9-2.6.8-3.8.2-1.4-.7-2.6-1.8-3.4-3.2-.7-1.2-.7-2.7-.4-3.8Z" />
    </svg>
  );
}

export function PageMeta({
  title,
  description,
  path,
  image = "/og.jpg",
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}) {
  const canonical = `${siteOrigin()}${path}`;

  useEffect(() => {
    document.title = title;
    const nodes: HTMLElement[] = [];
    const set = (attr: "name" | "property", key: string, content: string) => {
      const selector = `meta[${attr}="${key}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        nodes.push(el);
      }
      el.content = content;
    };
    const imageUrl = image.startsWith("http") ? image : `${siteOrigin()}${image}`;
    const shareCard = image === "/og.jpg";
    set("name", "description", description);
    set("property", "og:site_name", galleryName);
    set("property", "og:title", title);
    set("property", "og:description", description);
    set("property", "og:type", "website");
    set("property", "og:url", canonical);
    set("property", "og:image", imageUrl);
    set("property", "og:image:alt", title);
    if (shareCard) {
      set("property", "og:image:width", "1200");
      set("property", "og:image:height", "630");
      set("property", "og:image:type", "image/jpeg");
    }
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:title", title);
    set("name", "twitter:description", description);
    set("name", "twitter:image", imageUrl);
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
      nodes.push(link);
    }
    link.href = canonical;
    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [canonical, description, image, title, JSON.stringify(jsonLd)]);

  return null;
}

export function TextLink({
  children,
  href,
  color = "white",
}: {
  children: string;
  href: string;
  color?: "black" | "white";
}) {
  const className = `b2 ${color === "black" ? "text-black" : "text-white"}`;
  if (href.startsWith("/")) return <Link className={className} to={href}>{children}</Link>;
  return <a className={className} href={href}>{children}</a>;
}

export function ArrowLink({ children, href }: { children: string; href: string }) {
  const className = "inline-flex items-center gap-3 text-white";
  const inner = (
    <>
      <span className="b5">{children}</span>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M13.5 5L20.5 12L13.5 19M3.5 12L20 12" stroke="black" strokeWidth="2" />
        </svg>
      </span>
    </>
  );
  if (href.startsWith("/")) return <Link className={className} to={href}>{inner}</Link>;
  return <a className={className} href={href}>{inner}</a>;
}
