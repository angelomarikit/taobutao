export type AssistantTopic = {
  id: string;
  label: string;
  keywords: string;
  answer: string;
};

export const assistantButton = "Ask Voxart AI";

export const assistantGreeting =
  "Hello. I can answer from the gallery’s saved notes.\n\nChoose a topic, or ask about artists, works, exhibitions, and visits.";

export const assistantPlaceholder = "Ask about artists, works, exhibitions…";

export const assistantTopics: AssistantTopic[] = [
  {
    id: "artists",
    label: "Artists",
    keywords: "artist, tao, butao",
    answer: "TAO BUTAO is represented by Voxartgallery. Open Artist in the menu to see each artist and their works. More artists can be added from the admin.",
  },
  {
    id: "works",
    label: "Works",
    keywords: "work, artwork, relief, piece",
    answer: "The gallery shows crumpled metal reliefs. Open Auctions in the menu to see the works. To ask about a specific piece, use Contact.",
  },
  {
    id: "exhibitions",
    label: "Exhibitions",
    keywords: "exhibition, show, resilience, blueprint",
    answer: "Resilience ran 23 Jan–09 Feb 2025 at Art Anton, G/F, S Maison at Conrad, Marina Way, MOA Complex, 1300 Pasay City. Blueprint was presented at Arte Bettina. Both are in the journal.",
  },
  {
    id: "visit",
    label: "Visit",
    keywords: "visit, hour, address, where, location",
    answer: "Resilience was held at Art Anton, G/F, S Maison at Conrad, Marina Way, MOA Complex, 1300 Pasay City, PH. For the current visit, write to the gallery through Contact.",
  },
  {
    id: "buy",
    label: "How to buy",
    keywords: "buy, purchase, acquire, sell, consign, price",
    answer: "Use Contact and include your name, email, and the work you are asking about. The gallery replies by email.",
  },
  {
    id: "about",
    label: "About",
    keywords: "about, voxart, gallery",
    answer: "Voxartgallery is a contemporary gallery. TAO BUTAO is one of its artists. Instagram is @tao_butao and Facebook is facebook.com/taobutao82.",
  },
];

export function readTopics(raw: string | undefined): AssistantTopic[] {
  if (!raw?.trim()) return assistantTopics;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return assistantTopics;
    const topics = parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const row = item as Partial<AssistantTopic>;
      if (!row.label?.trim() || !row.answer?.trim()) return [];
      return [{ id: row.id || row.label, label: row.label.trim(), keywords: row.keywords || "", answer: row.answer.trim() }];
    });
    return topics;
  } catch {
    return assistantTopics;
  }
}

export function matchTopic(question: string, topics: AssistantTopic[]) {
  const text = question.toLowerCase();
  let best: { topic: AssistantTopic; score: number } | null = null;
  for (const topic of topics) {
    const words = `${topic.label}, ${topic.keywords}`.split(",").map((word) => word.trim().toLowerCase()).filter(Boolean);
    const score = words.reduce((total, word) => (text.includes(word) ? total + word.length : total), 0);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic;
}
