import { useEffect, useState, type FormEvent } from "react";
import { assistantButton, assistantGreeting, assistantPlaceholder, assistantTopics, type AssistantTopic } from "@/data/assistant";
import { supabase } from "@/lib/supabase";

const fieldClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

export function AssistantAdmin() {
  const [button, setButton] = useState(assistantButton);
  const [greeting, setGreeting] = useState(assistantGreeting);
  const [placeholder, setPlaceholder] = useState(assistantPlaceholder);
  const [topics, setTopics] = useState<AssistantTopic[]>(assistantTopics);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void supabase!.from("site_settings").select("key,value").in("key", ["assistant_button", "assistant_greeting", "assistant_placeholder", "assistant_topics"]).then(({ data, error: loadError }) => {
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const saved = new Map((data ?? []).map((row) => [row.key, row.value]));
      if (saved.get("assistant_button")) setButton(saved.get("assistant_button") || assistantButton);
      if (saved.get("assistant_greeting")) setGreeting(saved.get("assistant_greeting") || assistantGreeting);
      if (saved.get("assistant_placeholder")) setPlaceholder(saved.get("assistant_placeholder") || assistantPlaceholder);
      const raw = saved.get("assistant_topics");
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as AssistantTopic[];
        if (Array.isArray(parsed) && parsed.length) setTopics(parsed);
      } catch {
        setError("The saved topics could not be read. The form is showing the original answers.");
      }
    });
  }, []);

  function update(id: string, patch: Partial<AssistantTopic>) {
    setTopics((current) => current.map((topic) => (topic.id === id ? { ...topic, ...patch } : topic)));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const rows = [
      { key: "assistant_button", value: button.trim() || assistantButton },
      { key: "assistant_greeting", value: greeting.trim() || assistantGreeting },
      { key: "assistant_placeholder", value: placeholder.trim() || assistantPlaceholder },
      { key: "assistant_topics", value: JSON.stringify(topics.filter((topic) => topic.label.trim() && topic.answer.trim())) },
    ];
    const { error: saveError } = await supabase!.from("site_settings").upsert(rows, { onConflict: "key" });
    if (saveError) setError(saveError.message);
    else setNotice("These answers are now what the assistant says on the website.");
  }

  return (
    <form onSubmit={(event) => void save(event)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Assistant</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">Each topic is a button in the chat. The answer is what visitors see when they tap it or ask something with those words.</p>
        </div>
        <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Save assistant</button>
      </div>
      <div className="mt-6 grid max-w-3xl gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5">
        <label className="text-sm text-neutral-300">Button label<input className={fieldClass} value={button} onChange={(event) => setButton(event.target.value)} /></label>
        <label className="text-sm text-neutral-300">Greeting<textarea className={`${fieldClass} min-h-28`} value={greeting} onChange={(event) => setGreeting(event.target.value)} /></label>
        <label className="text-sm text-neutral-300">Question box placeholder<input className={fieldClass} value={placeholder} onChange={(event) => setPlaceholder(event.target.value)} /></label>
      </div>
      <div className="mt-6 grid max-w-3xl gap-4">
        {topics.map((topic, index) => (
          <fieldset key={topic.id} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <legend className="px-1 text-sm text-neutral-400">Topic {index + 1}</legend>
            <label className="mt-3 block text-sm text-neutral-300">Button text<input className={fieldClass} value={topic.label} onChange={(event) => update(topic.id, { label: event.target.value })} /></label>
            <label className="mt-4 block text-sm text-neutral-300">Words that should bring up this answer<input className={fieldClass} value={topic.keywords} onChange={(event) => update(topic.id, { keywords: event.target.value })} placeholder="artist, tao, butao" /></label>
            <label className="mt-4 block text-sm text-neutral-300">Answer<textarea className={`${fieldClass} min-h-28`} value={topic.answer} onChange={(event) => update(topic.id, { answer: event.target.value })} /></label>
            <button className="mt-4 text-sm text-neutral-400" type="button" onClick={() => setTopics((current) => current.filter((item) => item.id !== topic.id))}>Remove topic</button>
          </fieldset>
        ))}
        <button
          className="w-fit rounded-lg border border-white/15 px-4 py-2 text-sm"
          type="button"
          onClick={() => setTopics((current) => [...current, { id: crypto.randomUUID(), label: "", keywords: "", answer: "" }])}
        >
          Add topic
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-neutral-300">{notice}</p> : null}
    </form>
  );
}
