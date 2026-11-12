import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useOpenContact } from "@/components/ContactDialog";
import { contactMailto, galleryLockup, galleryName, socialLinks } from "@/data/reference";
import { copyText } from "@/lib/content";
import { siteOrigin } from "@/lib/supabase";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Journal", to: "/journal" },
];

function NavItem({ label, to, className }: { label: string; to: string; className: string }) {
  return (
    <NavLink className={className} to={to}>
      {label}
    </NavLink>
  );
}

function SocialLink({ label, href, className }: { label: string; href: string; className: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

function publicSocials(copy?: Record<string, string>) {
  return [
    { label: "Instagram", href: copyText(copy, "settings.instagram_url", socialLinks[0].href) },
    { label: "Facebook", href: copyText(copy, "settings.facebook_url", socialLinks[1].href) },
  ];
}

export function Navigation({ copy }: { copy?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const openContact = useOpenContact();
  const location = useLocation();
  const socials = publicSocials(copy);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[8] bg-black text-white">
      <div className="mx-auto hidden h-auto items-center px-10 py-5 min-[1100px]:grid min-[1100px]:grid-cols-3">
        <nav className="flex items-center gap-[34px]">
          {links.slice(0, 3).map((link) => (
            <NavItem key={link.label} {...link} className="label text-white" />
          ))}
        </nav>
        <Link to="/" className="wordmark text-center text-white">
          {galleryName}
        </Link>
        <nav className="flex items-center justify-end gap-5">
          {links.slice(3).map((link) => (
            <NavItem key={link.label} {...link} className="label text-white" />
          ))}
          <button className="label cursor-pointer border-0 bg-transparent p-0 text-white" type="button" onClick={openContact}>
            Contact
          </button>
          {socials.map((link) => (
            <SocialLink key={link.label} {...link} className="label text-white" />
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center px-5 py-5 min-[1100px]:hidden">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className="flex w-[22px] flex-col gap-[5px]">
            <span className="h-px bg-white" />
            <span className="h-px bg-white" />
            <span className="h-px bg-white" />
          </span>
        </button>
        <Link to="/" className="wordmark truncate text-center text-[22px] text-white">
          {galleryName}
        </Link>
        <span className="h-11 w-11" />
      </div>

      <div hidden={!open} className={`nav-overlay absolute inset-x-0 top-0 h-screen bg-black px-7 pt-7 pb-14 ${open ? "is-open" : ""}`}>
        <div className="grid grid-cols-[44px_1fr_44px] items-center">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-white"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span className="text-[22px] leading-none">×</span>
          </button>
          <Link to="/" className="wordmark text-center text-white">
            {galleryName}
          </Link>
          <span />
        </div>
        <nav className="mt-14 flex flex-col items-start gap-[22px]">
          <Link className="h2 text-white" to="/">Home</Link>
          <Link className="h2 text-white" to="/about">About</Link>
          <Link className="h2 text-white" to="/gallery">Gallery</Link>
          <Link className="h2 text-white" to="/journal">journal</Link>
          <Link className="h2 text-white" to="/journal">Journal</Link>
          <button className="h2 cursor-pointer border-0 bg-transparent p-0 text-left text-white" type="button" onClick={() => { setOpen(false); openContact(); }}>
            Contact
          </button>
          {socials.map((link) => (
            <SocialLink key={link.label} {...link} className="h2 text-white" />
          ))}
        </nav>
      </div>
    </header>
  );
}

const footerSections = [
  ["Home", "/"],
  ["About", "/about"],
  ["Gallery", "/gallery"],
  ["Journal", "/journal"],
] as const;

export function Footer({ copy }: { copy?: Record<string, string> }) {
  const openContact = useOpenContact();
  const mailto = copyText(copy, "settings.contact_mailto", contactMailto);
  const hours = copyText(copy, "settings.visit_hours", "Tue – Fri, 11 – 18\nSat – Sun, 11 – 16\nMon, Closed").split("\n").filter(Boolean);
  const socials = publicSocials(copy);
  return (
    <footer className="bg-black px-10 pt-[100px] pb-5 text-white max-[810px]:px-5">
      <div className="flex items-start justify-between gap-[80px] max-[810px]:flex-col max-[810px]:gap-10">
        <div className="max-w-[440px]">
          <p className="h2 text-white">
            {galleryLockup.split("\n").map((word, index) => (
              <span key={word}>{index ? <br /> : null}{word}</span>
            ))}
          </p>
          <p className="b5 mt-6 text-white">{copyText(copy, "settings.footer_tagline", "Contemporary Art · Quarterly · Since 1998")}</p>
          <p className="b6 mt-8 text-white">{copyText(copy, "settings.gallery_address", "Bredgade 41, Copenhagen K. Admission free; quiet appreciated.")}</p>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-10 max-[810px]:grid-cols-1">
          <div>
            <p className="b5 text-white">SECTIONS</p>
            <ul className="mt-6 space-y-3">
              {footerSections.map(([label, to]) => (
                <li key={label}>
                  <Link className="footer-link b6 text-white" to={to}>{label}</Link>
                </li>
              ))}
              <li>
                <button className="footer-link b6 cursor-pointer border-0 bg-transparent p-0 text-left text-white" type="button" onClick={openContact}>
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="b5 text-white">CORRESPONDENCE</p>
            <ul className="mt-6 space-y-3">
              <li><a className="footer-link b6" href={mailto}>{copyText(copy, "settings.contact_email", "post@novumgallery.com")}</a></li>
              <li><a className="footer-link b6" href={mailto}>{copyText(copy, "settings.press_email", "press@novumgallery.com")}</a></li>
              <li><span className="footer-link b6">{copyText(copy, "settings.contact_phone", "+45 33 14 22 08")}</span></li>
            </ul>
          </div>
          <div>
            <p className="b5 text-white">VISIT</p>
            <ul className="mt-6 space-y-3">
              {hours.map((line) => <li key={line} className="b6">{line}</li>)}
            </ul>
          </div>
          <div>
            <p className="b5 text-white">SOCIAL</p>
            <ul className="mt-6 space-y-3">
              {socials.map((link) => (
                <li key={link.label}>
                  <SocialLink {...link} className="footer-link b6 text-white" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-20 border-t border-white/40 pt-5">
        <div className="flex items-center justify-between gap-6 max-[390px]:flex-col max-[390px]:items-start">
          <p className="b6">{copyText(copy, "settings.footer_copyright", "© MMXXVI · Voxartgallery")}</p>
          <p className="b6">{copyText(copy, "settings.footer_credit", "Designed by Tomiwa Olaide")}</p>
        </div>
      </div>
    </footer>
  );
}

export function PageMeta({
  title,
  description,
  path,
  image = "/media/social.png",
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
    set("name", "description", description);
    set("property", "og:title", title);
    set("property", "og:description", description);
    set("property", "og:type", "website");
    set("property", "og:url", canonical);
    set("property", "og:image", image.startsWith("http") ? image : `${siteOrigin()}${image}`);
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
