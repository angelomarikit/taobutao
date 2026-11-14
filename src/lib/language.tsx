import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "fil";

export const languages: { id: Language; code: string; name: string }[] = [
  { id: "en", code: "EN", name: "English" },
  { id: "fil", code: "FIL", name: "Filipino" },
];

const dictionary = {
  en: {
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    signIn: "Sign in",
    signInButton: "Sign In",
    search: "Search artists, works, exhibitions",
    noResults: "No results",
    hintArtist: "Artist",
    hintWork: "Work",
    hintExhibition: "Exhibition",
    hintStory: "Story",
    home: "Home",
    auctions: "Auctions",
    exhibition: "Exhibition",
    exhibitions: "Exhibitions",
    artist: "Artist",
    artworks: "All Artworks",
    about: "About us",
    contact: "Contact us",
    buy: "How to buy",
    sell: "How to sell",
    faq: "FAQ",
    all: "All",
    live: "Live",
    upcoming: "Upcoming",
    previous: "Previous",
    ongoing: "Ongoing",
    liveAuction: "Live auction",
    noAuctions: "No auctions",
    noUpcoming: "No Upcoming Exhibition",
    noUpcomingDetail: "There is no upcoming exhibition scheduled.",
    visitSchedule: "Visits follow the exhibition schedule.",
    noExhibitions: "No exhibitions",
    allArtists: "All Artists",
    byName: "By Name",
    filter: "Filter",
    noArtists: "No artists",
  },
  fil: {
    language: "Wika",
    openMenu: "Buksan ang menu",
    closeMenu: "Isara ang menu",
    signIn: "Mag-sign in",
    signInButton: "Mag-sign In",
    search: "Maghanap ng artista, obra, o eksibisyon",
    noResults: "Walang resulta",
    hintArtist: "Artista",
    hintWork: "Obra",
    hintExhibition: "Eksibisyon",
    hintStory: "Kuwento",
    home: "Tahanan",
    auctions: "Subasta",
    exhibition: "Eksibisyon",
    exhibitions: "Mga Eksibisyon",
    artist: "Artista",
    artworks: "Lahat ng Likha",
    about: "Tungkol sa Amin",
    contact: "Makipag-ugnayan",
    buy: "Paano Bumili",
    sell: "Paano Magbenta",
    faq: "Mga Tanong",
    all: "Lahat",
    live: "Live",
    upcoming: "Paparating",
    previous: "Nakaraan",
    ongoing: "Kasalukuyan",
    liveAuction: "Live na subasta",
    noAuctions: "Walang subasta",
    noUpcoming: "Walang Paparating na Eksibisyon",
    noUpcomingDetail: "Walang nakatakdang paparating na eksibisyon.",
    visitSchedule: "Ang pagbisita ay ayon sa iskedyul ng eksibisyon.",
    noExhibitions: "Walang eksibisyon",
    allArtists: "Lahat ng Artista",
    byName: "Ayon sa Pangalan",
    filter: "Salain",
    noArtists: "Walang artista",
  },
} as const;

export type CopyKey = keyof (typeof dictionary)["en"];

const storageKey = "voxart-language";

type LanguageValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

function storedLanguage(): Language {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "fil" || saved === "en") return saved;
  } catch {
    /* private browsing can block storage */
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(storedLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "fil" ? "fil" : "en";
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      /* ignore storage failures */
    }
  }, [language]);

  const value = useMemo<LanguageValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: (key) => dictionary[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used within LanguageProvider");
  return value;
}
