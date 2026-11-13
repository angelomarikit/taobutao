import { useEffect, useMemo, useState, type FormEvent } from "react";
import { assistantButton, assistantGreeting, assistantPlaceholder, matchTopic, readTopics } from "@/data/assistant";
import { copyText } from "@/lib/content";
import { galleryName } from "@/data/reference";

type Note = { role: "visitor" | "assistant"; text: string };

export function GalleryAssistant({ copy }: { copy?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const button = copyText(copy, "settings.assistant_button", assistantButton);
  const greeting = copyText(copy, "settings.assistant_greeting", assistantGreeting);
  const placeholder = copyText(copy, "settings.assistant_placeholder", assistantPlaceholder);
  const topics = useMemo(() => readTopics(copy?.["settings.assistant_topics"]), [copy]);
  const [notes, setNotes] = useState<Note[]>([{ role: "assistant", text: greeting }]);

  useEffect(() => {
    setNotes((current) => (current.some((note) => note.role === "visitor") ? current : [{ role: "assistant", text: greeting }]));
  }, [greeting]);

  function reply(question: string) {
    const topic = matchTopic(question, topics);
    const answer = topic?.answer || "I can answer the topics in this window. Choose one, or use Contact to write to the gallery.";
    setNotes((current) => [...current, { role: "visitor", text: question }, { role: "assistant", text: answer }]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setDraft("");
    reply(question);
  }

  return (
    <div className="fixed right-4 bottom-4 z-[12] flex flex-col items-end gap-3 max-[810px]:right-3 max-[810px]:bottom-3 max-[810px]:left-3">
      {open ? (
        <section className="flex max-h-[min(640px,78vh)] w-[380px] flex-col overflow-hidden rounded-[28px] bg-[#f4f4f5] shadow-[0_20px_60px_rgba(0,0,0,0.35)] max-[810px]:w-full" style={{ color: "#1c1c1c", fontFamily: "Inter, sans-serif" }}>
          <header className="flex items-center gap-3 bg-white px-4 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-sm font-semibold" style={{ color: "#fff" }}>V</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold tracking-[0.08em] uppercase">{galleryName}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: "#666" }}>
                <span className="h-2 w-2 rounded-full bg-[#22a35a]" />
                Assistant
              </span>
            </span>
            <button type="button" className="grid h-9 w-9 place-items-center text-2xl leading-none" style={{ color: "#1c1c1c" }} aria-label="Close assistant" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {notes.map((note, index) => (
              <p key={`${note.role}-${index}`} className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${note.role === "visitor" ? "ml-auto bg-black" : "bg-white"}`} style={{ color: note.role === "visitor" ? "#fff" : "#1c1c1c" }}>
                {note.text}
              </p>
            ))}
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button key={topic.id} type="button" className="rounded-full border bg-white px-3 py-2 text-left text-sm" style={{ borderColor: "#e4e4e7", color: "#1c1c1c" }} onClick={() => reply(topic.label)}>
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          <form className="flex items-center gap-2 bg-white px-3 py-3" onSubmit={submit}>
            <input className="min-w-0 flex-1 rounded-full border px-4 py-3 text-sm outline-none" style={{ borderColor: "#e4e4e7", color: "#1c1c1c", background: "#fff" }} placeholder={placeholder} value={draft} onChange={(event) => setDraft(event.target.value)} />
            <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black" style={{ color: "#fff" }} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" />
              </svg>
            </button>
          </form>
        </section>
      ) : null}
      <button type="button" className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]" style={{ color: "#1c1c1c" }} onClick={() => setOpen((current) => !current)}>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-sm font-semibold" style={{ color: "#fff" }}>V</span>
        <span className="text-sm font-medium">{open ? "Close" : button}</span>
      </button>
    </div>
  );
}
