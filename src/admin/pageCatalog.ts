export type SectionField = {
  name: "heading" | "body" | "image_url" | "link_url";
  label: string;
  fallback: string;
  multiline?: boolean;
  accept?: string;
};

export type PageSection = {
  key: string;
  title: string;
  fields: SectionField[];
};

const image = "image/*";
const video = "video/mp4,video/webm";

export const homeSections: PageSection[] = [
  {
    key: "hero",
    title: "Hero",
    fields: [
      { name: "heading", label: "Lockup", fallback: "Voxart\nGallery", multiline: true },
      { name: "body", label: "Caption", fallback: "Resilience\nby TAO BUTAO\n1.23.25", multiline: true },
    ],
  },
  {
    key: "hero-media",
    title: "Hero image",
    fields: [
      { name: "image_url", label: "Image", fallback: "/media/hero-banner.png", accept: image },
      { name: "heading", label: "Image description", fallback: "Two copper relief works installed in a gallery corner" },
    ],
  },
  {
    key: "about-year",
    title: "About us — year",
    fields: [{ name: "heading", label: "Year", fallback: "2026" }],
  },
  {
    key: "about-intro",
    title: "About us",
    fields: [
      { name: "heading", label: "Heading", fallback: "ABOUT US" },
      { name: "body", label: "Introduction", fallback: "Founded with a commitment to supporting emerging and established artists, the gallery creates meaningful connections between art, culture, and community.", multiline: true },
    ],
  },
  {
    key: "about-photo",
    title: "About us — photograph",
    fields: [
      { name: "image_url", label: "Photograph", fallback: "/media/resilience.jpg", accept: image },
      { name: "heading", label: "Image description", fallback: "Resilience by TAO BUTAO, 1.23.25" },
      { name: "body", label: "Button label above the link", fallback: "COME SEE US" },
      { name: "link_url", label: "Ticket link", fallback: "mailto:tommydreamchaser@gmail.com" },
    ],
  },
  {
    key: "stats",
    title: "About us — figures",
    fields: [{ name: "body", label: "One figure per line, written as number | label", fallback: "126 | UNIQUE ART WORKS\n38 | FEATURED ARTIST\n24 | YEARS OF EXCELLENCE", multiline: true }],
  },
  {
    key: "onview",
    title: "On view",
    fields: [
      { name: "heading", label: "Small label", fallback: "On View" },
      { name: "body", label: "Title, subtitle, text, and date. Separate the blocks with a blank line.", fallback: "‘Resilience’\n\nA Solo Exhibition by TAO BUTAO\n\nTAO BUTAO’s ‘Resilience’ transforms the inherent rigidity of metal into a contemplative exploration of struggle, endurance, and transformation. Each crumpled surface becomes a narrative of tension and release, a dialogue between force and surrender. Through Tao’s process, metal—a material often associated with strength and permanence—is reimagined as pliable, vulnerable, and deeply evocative. The folds and creases, simultaneously chaotic and deliberate, serve as metaphors for resilience, capturing the moments where destruction transitions into renewal, and where imperfection becomes a source of beauty.\n\n23 Jan — 09 Feb 2025 · @tao_butao", multiline: true },
    ],
  },
  {
    key: "onview-image",
    title: "On view — photograph",
    fields: [
      { name: "image_url", label: "Photograph", fallback: "/media/resilience-gold.png", accept: image },
      { name: "heading", label: "Image description", fallback: "Resilience, a solo exhibition by TAO BUTAO" },
    ],
  },
  {
    key: "selected",
    title: "Selected arts",
    fields: [
      { name: "heading", label: "Count", fallback: "(20)" },
      { name: "body", label: "Heading and description, separated by a blank line", fallback: "SELECTED arts\n\nA curated selection from recent collections  paintings, sculpture, photography, and installation by represented artists.", multiline: true },
    ],
  },
  {
    key: "selected-slide",
    title: "Selected arts — banner",
    fields: [
      { name: "heading", label: "Title", fallback: "White Horizon" },
      { name: "image_url", label: "Image", fallback: "/media/resilience-trio.jpg", accept: image },
      { name: "link_url", label: "Artwork link", fallback: "/gallery" },
    ],
  },
  {
    key: "visit-1",
    title: "Visit photograph 1",
    fields: [
      { name: "image_url", label: "Image", fallback: "/media/visit-1.jpg", accept: image },
      { name: "heading", label: "Image description", fallback: "Two visitors with a red relief and a black relief" },
    ],
  },
  {
    key: "visit-2",
    title: "Visit photograph 2",
    fields: [
      { name: "image_url", label: "Image", fallback: "/media/visit-2.jpg", accept: image },
      { name: "heading", label: "Image description", fallback: "Visitors looking at a black relief in the gallery" },
    ],
  },
  {
    key: "visit-3",
    title: "Visit photograph 3",
    fields: [
      { name: "image_url", label: "Image", fallback: "/media/visit-3.jpg", accept: image },
      { name: "heading", label: "Image description", fallback: "A group standing in the gallery beside the black relief" },
    ],
  },
  {
    key: "showreel",
    title: "Showreel",
    fields: [{ name: "image_url", label: "Video", fallback: "/media/showreel.mp4", accept: video }],
  },
  {
    key: "events",
    title: "Upcoming events",
    fields: [
      { name: "heading", label: "Small label and heading, separated by a blank line", fallback: "CALENDAR\n\nUPCOMING EVENTS", multiline: true },
      { name: "body", label: "Message", fallback: "Wait for scheduled events" },
      { name: "link_url", label: "Ticket link label and address, separated by a blank line", fallback: "BOOK YOUR TICKET NOW\n\nmailto:tommydreamchaser@gmail.com", multiline: true },
      { name: "image_url", label: "Video", fallback: "/media/events-clip.mp4", accept: video },
    ],
  },
  {
    key: "journal",
    title: "Journal strip",
    fields: [
      { name: "heading", label: "Small label and heading, separated by a blank line", fallback: "JOURNAL\n\nPERSPECTIVES", multiline: true },
      { name: "body", label: "Description", fallback: "Stories, essays, and reflections from artists and curators." },
    ],
  },
];

export const aboutSections: PageSection[] = [
  {
    key: "hero",
    title: "Opening",
    fields: [
      { name: "heading", label: "Heading", fallback: "TAO BUTAO" },
      { name: "body", label: "Lead", fallback: "Metal, crumpled into folds. Strength shaped by the marks of pressure, time, and transformation.", multiline: true },
      { name: "image_url", label: "Photograph", fallback: "/media/about-black-reliefs.jpg", accept: image },
      { name: "link_url", label: "Photograph description", fallback: "TAO BUTAO beside two black reliefs" },
    ],
  },
  {
    key: "work",
    title: "The work",
    fields: [
      { name: "heading", label: "Label", fallback: "The work" },
      { name: "body", label: "Paragraphs, separated by a blank line", fallback: "‘Resilience’ by Tao Butao transforms metal, often seen as rigid and unyielding, into a profound exploration of struggle, endurance, and renewal. Each crumpled fold becomes a narrative of tension and release, embracing imperfection as a testament to transformation. The reflective surfaces capture the delicate balance between strength and fragility.\n\nInstead of imitating life and its figurative forms, TAO Butao makes use of inanimate objects and crumples them into unpredictable folds— an echo of the volatility and uncertainty of reality, a vital component of life itself. As a whole, Blueprint is a series of works that resonate with existence itself at its base nature.\n\nText by Melissa Uy", multiline: true },
    ],
  },
  {
    key: "resilience",
    title: "Resilience",
    fields: [
      { name: "image_url", label: "Poster", fallback: "/media/resilience-journal.jpg", accept: image },
      { name: "heading", label: "Label and title, separated by a blank line", fallback: "Solo exhibit\n\n‘Resilience’", multiline: true },
      { name: "body", label: "Dates and place, separated by a blank line", fallback: "01.23.25 – 02.09.25\n\nArt Anton, G/F, S Maison at Conrad, Marina Way, MOA Complex, 1300 Pasay City, PH", multiline: true },
    ],
  },
  {
    key: "blueprint",
    title: "Blueprint",
    fields: [
      { name: "image_url", label: "Photograph", fallback: "/media/about-bettina-1.jpg", accept: image },
      { name: "heading", label: "Label and title, separated by a blank line", fallback: "Solo show\n\nBlueprint", multiline: true },
      { name: "body", label: "Place and note, separated by a blank line", fallback: "Arte Bettina\n\nGuest of honor Luis E. Yee, Jr., better known as Junyee.", multiline: true },
    ],
  },
  ...[
    ["/media/about-bettina-2.jpg", "Guests outside Arte Bettina at the Blueprint opening"],
    ["/media/about-black-pair.jpg", "TAO BUTAO with a guest beside two black reliefs"],
    ["/media/about-visit.png", "TAO BUTAO with guests in a gallery"],
    ["/media/about-opening.jpg", "TAO BUTAO with guests at an opening"],
    ["/media/blueprint-cover.jpg", "TAO BUTAO in front of red, gold, and blue reliefs"],
    ["/media/resilience-gold.png", "Gold and black reliefs from Resilience"],
  ].map(([src, alt], index): PageSection => ({
    key: `photo-${index + 1}`,
    title: `Photograph ${index + 1}`,
    fields: [
      { name: "image_url", label: "Image", fallback: src, accept: image },
      { name: "heading", label: "Image description", fallback: alt },
    ],
  })),
  {
    key: "showreel",
    title: "Showreel",
    fields: [{ name: "image_url", label: "Video", fallback: "/media/showreel.mp4", accept: video }],
  },
];

export const gallerySections: PageSection[] = [
  {
    key: "intro",
    title: "Gallery introduction",
    fields: [
      { name: "heading", label: "Heading", fallback: "GALLERY" },
      { name: "body", label: "Introduction", fallback: "Artists of Voxartgallery." },
    ],
  },
];

export const journalSections: PageSection[] = [
  {
    key: "intro",
    title: "Journal introduction",
    fields: [
      { name: "heading", label: "Heading", fallback: "Journal" },
      { name: "body", label: "Introduction", fallback: "Go behind the canvas with The Canvas Journal. Explore our latest curatorial insights, in-depth artist profiles, and behind-the-scenes exhibitions.", multiline: true },
    ],
  },
];

export const contactSections: PageSection[] = [
  {
    key: "dialog",
    title: "Contact window",
    fields: [
      { name: "heading", label: "Small label", fallback: "CONTACT" },
      { name: "body", label: "Heading", fallback: "Write to the gallery" },
    ],
  },
];

export const settingFields: { key: string; label: string; fallback: string; multiline?: boolean }[] = [
  { key: "press_email", label: "Press email", fallback: "tommydreamchaser@gmail.com" },
];
