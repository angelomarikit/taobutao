import type { Artist, Artwork, Exhibition, JournalArticle, TeamMember } from "@/types";

export const galleryName = "Voxartgallery";
export const siteTitle = "Voxartgallery";
export const galleryLockup = "Voxart\nGallery";

export const contactMailto = "mailto:tommydreamchaser@gmail.com";

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/tao_butao" },
  { label: "Facebook", href: "https://www.facebook.com/taobutao82" },
] as const;

const reliefs: { file: string; alt: string }[] = [
  { file: "relief-01.jpg", alt: "A wide red crumpled metal relief in a red frame" },
  { file: "relief-02.jpg", alt: "A vertical red and white crumpled relief in a red frame" },
  { file: "relief-03.jpg", alt: "A red crumpled relief with a white triangular fold" },
  { file: "relief-04.jpg", alt: "A red crumpled relief crossed by a white band" },
  { file: "relief-05.jpg", alt: "A red and white crumpled relief with a gold crest" },
  { file: "relief-06.jpg", alt: "A wide blue crumpled metal relief in a blue frame" },
  { file: "relief-07.jpg", alt: "A wide gold crumpled metal relief in a gold frame" },
  { file: "relief-08.jpg", alt: "A red, white, and blue crumpled relief" },
  { file: "relief-09.jpg", alt: "An orange and black crumpled relief with lettering" },
  { file: "relief-10.jpg", alt: "A red crumpled relief with a white script band" },
  { file: "relief-11.jpg", alt: "A green crumpled relief with two red stars" },
  { file: "relief-12.jpg", alt: "A vertical red and white crumpled relief in a black frame" },
  { file: "relief-13.png", alt: "A purple crumpled metal relief in a black frame" },
  { file: "relief-14.png", alt: "A crumpled relief made from folded road signs" },
  { file: "relief-15.png", alt: "A tall copper crumpled metal relief" },
  { file: "relief-16.png", alt: "A wide copper crumpled metal relief" },
];

const reliefStatement =
  "TAO BUTAO crumples metal into unpredictable folds, an echo of the volatility and uncertainty of reality. Each surface holds the marks of pressure, endurance, and renewal.";

export const referenceArtworks: Artwork[] = reliefs.map((relief, index) => {
  const number = String(index + 1).padStart(2, "0");
  const image = `/media/works/${relief.file}`;
  return {
    id: `relief-${number}`,
    title: `Relief ${number}`,
    slug: `relief-${number}`,
    medium: "Crumpled metal relief",
    heroImage: image,
    heroAlt: relief.alt,
    detailImage: image,
    detailDescription: relief.alt + ". A work by TAO BUTAO.",
    artistName: "TAO BUTAO",
    artistSlug: "tao-butao",
    artistAge: "",
    artistImage: "",
    biography: reliefStatement,
    accolades: "Shown in the solo exhibitions ‘Resilience’, 23 Jan — 09 Feb 2025, and Blueprint.",
    contactLink: contactMailto,
    availability: "available",
    featured: index === 0,
    published: true,
  };
});


export const referenceArtists: Artist[] = [
  {
    id: "tao-butao",
    name: "TAO BUTAO",
    slug: "tao-butao",
    biography: reliefStatement,
    image: "/media/about-black-reliefs.jpg",
    imageAlt: "TAO BUTAO beside two black reliefs",
  },
];

export const referenceArticles: JournalArticle[] = [
  {
    id: "resilience-exhibit",
    title: "‘Resilience’ A Solo Exhibit by Tao Butao",
    slug: "resilience",
    category: "Exhibition",
    author: "Tao Butao",
    role: "Solo Exhibit",
    publishedOn: "2025-01-23",
    readTime: "01.23.25 – 02.09.25",
    excerpt: "A solo exhibit by Tao Butao, 01.23.25 – 02.09.25.",
    heroHeading: "‘Resilience’ A Solo Exhibit by Tao Butao",
    image: "/media/resilience-journal.jpg",
    imageAlt: "Resilience exhibition poster for TAO BUTAO",
    published: true,
    content: [
      {
        tag: "p",
        text: "‘Resilience’ by Tao Butao transforms metal, often seen as rigid and unyielding, into a profound exploration of struggle, endurance, and renewal. Each crumpled fold becomes a narrative of tension and release, embracing imperfection as a testament to transformation. The reflective surfaces capture the delicate balance between strength and fragility, inviting viewers to witness the beauty found in vulnerability and the grace of enduring pressure. Tao’s work redefines resilience, offering a meditation on the human condition—where strength is shaped not by perfection, but by the marks left through time and transformation.",
      },
    ],
  },
  {
    id: "blueprint",
    title: "Arte Bettina would like to congratulate the solo show of TAO Butao titled “Blueprint”",
    slug: "blueprint",
    category: "Exhibition",
    author: "Melissa Uy",
    role: "Arte Bettina",
    publishedOn: "2025-01-23",
    readTime: "Opening",
    excerpt: "A solo show by TAO Butao titled Blueprint, with a text by Melissa Uy.",
    heroHeading: "Blueprint",
    image: "/media/blueprint-cover.jpg",
    imageAlt: "TAO Butao standing in front of red, gold, and blue reliefs",
    published: true,
    content: [
      {
        tag: "p",
        text: "Arte Bettina would like to congratulate the solo show of TAO Butao titled “Blueprint”. We would like to thank our guest of Honor, Luis E. Yee, Jr., better known as Junyee for coming and celebrating the opening.",
      },
      {
        tag: "p",
        text: "Thank you as well to everyone who came for the opening!",
      },
      {
        tag: "p",
        text: "Instead of imitating life and its figurative forms, TAO Butao makes use of inanimate objects and crumples them into unpredictable folds— an echo of the volatility and uncertainty of reality, a vital component of life itself. A counterbalance to the polish and opulence of others in the market, he forges his own course and establishes his place in the art world.",
      },
      {
        tag: "p",
        text: "As a whole, Blueprint is a series of works that resonate with existence itself at its base nature, and TAO Butao invites us all to reexamine our perception on art, creation, and life.",
      },
      {
        tag: "p",
        text: "Text by Melissa Uy",
      },
    ],
    gallery: [
      { src: "/media/blueprint-02.jpg", alt: "Guests looking at a black relief during the Blueprint opening" },
      { src: "/media/blueprint-03.jpg", alt: "Guests gathered in the gallery at the Blueprint opening" },
      { src: "/media/blueprint-04.jpg", alt: "Two artists beside a red relief and a black relief" },
      { src: "/media/blueprint-05.jpg", alt: "Opening guests and a speaker beside the black relief" },
      { src: "/media/blueprint-06.jpg", alt: "The opening group in front of the red, gold, and blue reliefs" },
      { src: "/media/blueprint-07.jpg", alt: "Visitors beside a large red relief" },
      { src: "/media/blueprint-08.jpg", alt: "Guests speaking in front of the red and black reliefs" },
      { src: "/media/blueprint-09.jpg", alt: "Two artists in front of the red, gold, and blue reliefs" },
    ],
  },
];

export const referenceEvents: Exhibition[] = [
  {
    id: "artist-talk",
    day: "28",
    when: "JUNE 19:00",
    title: "ARTIST TALK",
    description: "An evening with Ines Mortensen in conversation with the gallery's editor.",
    location: "Gallery",
    link: contactMailto,
  },
  {
    id: "summer-opening",
    day: "12",
    when: "JULY 20:00",
    title: "Summer Opening Reception",
    description: "An evening with Ines Mortensen in conversation with the gallery's editor.",
    location: "Gallery",
    link: contactMailto,
  },
  {
    id: "collector-preview",
    day: "20",
    when: "AUGUST 18:00",
    title: "Collector Preview",
    description: "An evening with Ines Mortensen in conversation with the gallery's editor.",
    location: "Gallery",
    link: contactMailto,
  },
];

export const team: TeamMember[] = [
  {
    role: "Director",
    name: "elena voss",
    bio: "With over two decades of experience in contemporary art, Elena founded TAO BUTAO with a singular vision: to create a space where artists and audiences meet in meaningful dialogue and conversation.",
  },
  {
    role: "Chief Curator",
    name: "Marcus Chen",
    image: "/media/team-marcus.png",
    bio: "Marcus brings an interdisciplinary approach to curation, bridging fine art, architecture, and cultural theory to craft exhibitions that resonate across generations.",
  },
  {
    role: "Exhibition Manager",
    name: "Sofia Laurent",
    image: "/media/team-sofia.png",
    bio: "Sofia oversees the production and installation of every exhibition, ensuring each space becomes a stage for transformative artistic encounters.",
  },
];

export const milestones = [
  ["2000", "Gallery Founded"],
  ["2008", "First International Exhibition"],
  ["2016", "Permanent Collection Expanded"],
  ["2026", "Global Contemporary Programme"],
] as const;

export const locationFacts = [
  ["Main Gallery", "320 m²"],
  ["Project Space", "120 m²"],
  ["Reading Room", "80 m²"],
  ["Garden", "200 m²"],
] as const;

export const stats = [
  ["126", "UNIQUE ART WORKS"],
  ["38", "FEATURED ARTIST"],
  ["24", "YEARS OF EXCELLENCE"],
] as const;

export const visionBody = [
  "TAO BUTAO was conceived as more than a gallery. It is a living archive of contemporary thought, a space where the boundaries between artist, artwork, and audience dissolve into something more intimate and more enduring.",
  "We believe in the slow looking that great art demands. In an age of endless scrolling and instant consumption, we offer something rarer: the chance to stand still before something that refuses to be understood at a glance. Our exhibitions are conversations, not monologues. Our collections are arguments, not inventories.",
  "Every work we show, every artist we represent, every programme we host is chosen with a single question in mind: does this expand what we think art can be? If the answer is yes, we make room for it.",
];

export const curationBody = [
  "Our curatorial practice begins with deep research and ends with precise installation. Between those two points lies months of conversation, studio visits, and the careful negotiation of how a work wants to be seen.",
  "We do not chase trends. We follow artists who have something urgent to say and the discipline to say it well. Our role is to create the conditions in which their work can speak most clearly.",
  "The gallery programme alternates between solo presentations that offer immersive encounters with a single artist, and thematic group exhibitions that draw unexpected connections across generations and geographies.",
];
