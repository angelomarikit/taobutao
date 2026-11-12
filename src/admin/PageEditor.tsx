import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { PageSection } from "@/admin/pageCatalog";
import { supabase } from "@/lib/supabase";

export function ChooseFile({
  accept,
  multiple,
  idle = "No file chosen",
  onPick,
}: {
  accept?: string;
  multiple?: boolean;
  idle?: string;
  onPick: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState(idle);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111111" }} type="button" onClick={() => inputRef.current?.click()}>
        Choose file
      </button>
      <span className="min-w-0 truncate text-sm text-neutral-300">{chosen}</span>
      <input
        ref={inputRef}
        className="sr-only"
        accept={accept}
        multiple={multiple}
        type="file"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          setChosen(files.length ? files.map((file) => file.name).join(", ") : idle);
          if (files.length) onPick(files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

type Row = {
  section_key: string;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
};

async function uploadFile(file: File, folder: string) {
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase!.storage.from("gallery").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase!.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

export function PageEditor({
  page,
  title,
  publicPath,
  sections,
}: {
  page: string;
  title: string;
  publicPath: string;
  sections: PageSection[];
}) {
  const [saved, setSaved] = useState<Record<string, Row>>({});
  const [drafts, setDrafts] = useState<Record<string, Row>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [activeKey, setActiveKey] = useState(sections[0]?.key ?? "");
  const fieldClass = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

  useEffect(() => {
    let ignore = false;
    async function load() {
      const { data, error: loadError } = await supabase!
        .from("page_sections")
        .select("section_key,heading,body,image_url,link_url")
        .eq("page", page);
      if (ignore) return;
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const next: Record<string, Row> = {};
      for (const row of (data ?? []) as Row[]) next[row.section_key] = row;
      setSaved(next);
      setDrafts(next);
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    setActiveKey(sections[0]?.key ?? "");
  }, [page, sections]);

  function value(section: PageSection, name: "heading" | "body" | "image_url" | "link_url") {
    const draft = drafts[section.key];
    const stored = draft?.[name];
    if (typeof stored === "string" && stored.length) return stored;
    return section.fields.find((field) => field.name === name)?.fallback ?? "";
  }

  function update(section: PageSection, name: "heading" | "body" | "image_url" | "link_url", next: string) {
    setDrafts((current) => ({
      ...current,
      [section.key]: {
        section_key: section.key,
        heading: current[section.key]?.heading ?? saved[section.key]?.heading ?? null,
        body: current[section.key]?.body ?? saved[section.key]?.body ?? null,
        image_url: current[section.key]?.image_url ?? saved[section.key]?.image_url ?? null,
        link_url: current[section.key]?.link_url ?? saved[section.key]?.link_url ?? null,
        [name]: next,
      },
    }));
  }

  async function save(event: FormEvent, section: PageSection, index: number) {
    event.preventDefault();
    setError("");
    setNotice("");
    const draft = drafts[section.key];
    const payload = {
      page,
      section_key: section.key,
      heading: draft?.heading ?? section.fields.find((field) => field.name === "heading")?.fallback ?? null,
      body: draft?.body ?? section.fields.find((field) => field.name === "body")?.fallback ?? null,
      image_url: draft?.image_url ?? section.fields.find((field) => field.name === "image_url")?.fallback ?? null,
      link_url: draft?.link_url ?? section.fields.find((field) => field.name === "link_url")?.fallback ?? null,
      visible: true,
      display_order: index,
    };
    const { error: saveError } = await supabase!.from("page_sections").upsert(payload, { onConflict: "page,section_key" });
    if (saveError) setError(saveError.message);
    else setNotice(`${section.title} is now live on the public page.`);
  }

  const activeIndex = Math.max(0, sections.findIndex((section) => section.key === activeKey));
  const section = sections[activeIndex];
  const currentImage = section ? value(section, "image_url") : "";
  const imagePreview = /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(currentImage) ? currentImage : "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">Choose a section, edit it, then save. The public layout stays the same.</p>
        </div>
        <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to={publicPath}>View page</Link>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-neutral-300">{notice}</p> : null}
      {section ? (
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:max-h-[calc(100vh-9rem)] lg:flex-col lg:overflow-y-auto lg:pb-0">
            {sections.map((item) => {
              const selected = item.key === section.key;
              return (
                <button
                  key={item.key}
                  className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm lg:w-full ${selected ? "bg-white" : "hover:bg-white/5"}`}
                  style={{ color: selected ? "#111111" : "#d4d4d4" }}
                  type="button"
                  onClick={() => {
                    setActiveKey(item.key);
                    setNotice("");
                  }}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
          <form className="rounded-2xl border border-white/10 bg-[#141416] p-5" onSubmit={(event) => void save(event, section, activeIndex)}>
            <h2 className="text-lg font-medium">{section.title}</h2>
            <div className="mt-4 grid gap-4">
              {section.fields.map((field) => (
                <label key={field.name} className="block text-sm text-neutral-400">
                  {field.label}
                  {field.name === "image_url" ? (
                    <span className="mt-2 block space-y-3">
                      {imagePreview ? <img className="max-h-40 w-auto rounded-lg border border-white/10 object-contain" src={imagePreview} alt="" /> : null}
                      {currentImage ? <span className="block truncate text-xs text-neutral-500">{currentImage}</span> : null}
                      <ChooseFile
                        accept={field.accept || "image/*"}
                        onPick={(files) => {
                          const file = files[0];
                          if (!file) return;
                          void uploadFile(file, page).then((url) => update(section, "image_url", url)).catch((caught: unknown) => {
                            setError(caught instanceof Error ? caught.message : "Upload failed.");
                          });
                        }}
                      />
                    </span>
                  ) : field.multiline ? (
                    <textarea className={`${fieldClass} mt-2 min-h-28`} value={value(section, field.name)} onChange={(event) => update(section, field.name, event.target.value)} />
                  ) : (
                    <input className={`${fieldClass} mt-2`} value={value(section, field.name)} onChange={(event) => update(section, field.name, event.target.value)} />
                  )}
                </label>
              ))}
            </div>
            <button className="mt-5 rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111111" }} type="submit">Save {section.title}</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
