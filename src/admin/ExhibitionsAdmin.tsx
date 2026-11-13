import { useEffect, useState, type FormEvent } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChooseFile } from "@/admin/PageEditor";
import { referenceEvents } from "@/data/reference";
import { supabase } from "@/lib/supabase";

const fieldClass = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadCover(file: File) {
  const path = `exhibitions/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase!.storage.from("gallery").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase!.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

type ExhibitionRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  status: string;
  published: boolean;
};

type Starter = {
  title: string;
  slug: string;
  description: string;
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
};

function isStarter(value: unknown): value is Starter {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Starter>;
  return typeof row.title === "string" && typeof row.slug === "string";
}

function ExhibitionList() {
  const [rows, setRows] = useState<ExhibitionRow[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void supabase!.from("exhibitions").select("id,title,slug,description,cover_image,start_date,end_date,location,status,published").order("start_date", { ascending: false }).then(({ data, error: loadError }) => {
      if (loadError) setError(loadError.message);
      else setRows((data ?? []) as ExhibitionRow[]);
    });
  }, []);

  const stored = new Set(rows.map((row) => row.slug));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Exhibitions</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">Published exhibitions appear on the public Exhibitions page, with the picture above the title. Upcoming, ongoing, and previous follow the dates you enter.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to="/exhibitions">View page</Link>
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="button" onClick={() => navigate("/admin/exhibitions/new")}>Add exhibition</button>
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <Link key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4" to={`/admin/exhibitions/${row.id}`}>
            <span className="flex min-w-0 items-center gap-4">
              {row.cover_image ? <img className="h-16 w-24 shrink-0 bg-white object-cover" src={row.cover_image} alt="" /> : <span className="h-16 w-24 shrink-0 bg-white/10" />}
              <span className="min-w-0">
                <span className="block truncate text-sm">{row.title}</span>
                <span className="text-xs capitalize text-neutral-500">{row.published ? row.status : "Draft"}</span>
              </span>
            </span>
            <span className="text-xs text-neutral-400">Edit</span>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {referenceEvents.filter((exhibition) => !stored.has(exhibition.slug)).map((exhibition) => (
          <button
            key={exhibition.slug}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm"
            type="button"
            onClick={() => navigate("/admin/exhibitions/new", {
              state: {
                title: exhibition.title,
                slug: exhibition.slug,
                description: exhibition.description,
                image: exhibition.image,
                location: exhibition.location,
                startDate: exhibition.startDate,
                endDate: exhibition.endDate,
                status: exhibition.status,
              } satisfies Starter,
            })}
          >
            Save {exhibition.title} to the database
          </button>
        ))}
      </div>
    </div>
  );
}

function ExhibitionEditor() {
  const { id } = useParams();
  const location = useLocation();
  const starter = isStarter(location.state) ? location.state : null;
  const isNew = id === "new";
  const navigate = useNavigate();
  const [title, setTitle] = useState(starter?.title ?? "");
  const [slug, setSlug] = useState(starter?.slug ?? "");
  const [description, setDescription] = useState(starter?.description ?? "");
  const [image, setImage] = useState(starter?.image ?? "");
  const [locationText, setLocationText] = useState(starter?.location ?? "");
  const [startDate, setStartDate] = useState(starter?.startDate ?? "");
  const [endDate, setEndDate] = useState(starter?.endDate ?? "");
  const [status, setStatus] = useState(starter?.status ?? "past");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (isNew || !id) return;
    void supabase!.from("exhibitions").select("title,slug,description,cover_image,start_date,end_date,location,status,published").eq("id", id).maybeSingle().then(({ data, error: loadError }) => {
      if (loadError || !data) setError(loadError?.message || "Exhibition not found.");
      else {
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || "");
        setImage(data.cover_image || "");
        setLocationText(data.location || "");
        setStartDate(data.start_date || "");
        setEndDate(data.end_date || "");
        setStatus(data.status);
        setPublished(Boolean(data.published));
      }
    });
  }, [id, isNew]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const payload = {
      title: title.trim(),
      slug: slugify(slug || title),
      description: description.trim() || null,
      cover_image: image || null,
      start_date: startDate || null,
      end_date: endDate || null,
      location: locationText.trim() || null,
      status,
      published,
      featured: false,
    };
    const query = isNew
      ? supabase!.from("exhibitions").insert(payload).select("id").single()
      : supabase!.from("exhibitions").update(payload).eq("id", id).select("id").single();
    const { data, error: saveError } = await query;
    if (saveError || !data) setError(saveError?.message || "Could not save the exhibition.");
    else {
      setNotice(published ? "Saved in Supabase. This exhibition is live." : "Saved in Supabase as a draft. Drafts stay off the public page.");
      if (isNew) navigate(`/admin/exhibitions/${data.id}`, { replace: true });
    }
  }

  async function remove() {
    if (isNew || !id || !window.confirm("Delete this exhibition?")) return;
    const { error: deleteError } = await supabase!.from("exhibitions").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else navigate("/admin/exhibitions");
  }

  return (
    <form className="max-w-2xl" onSubmit={(event) => void save(event)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl">{isNew ? "Add exhibition" : "Edit exhibition"}</h1>
        <Link className="text-sm text-neutral-400" to="/admin/exhibitions">All exhibitions</Link>
      </div>
      <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5">
        <label className="text-sm text-neutral-300">
          Title
          <input className={`${fieldClass} mt-2`} value={title} onChange={(event) => { setTitle(event.target.value); if (isNew) setSlug(slugify(event.target.value)); }} required />
        </label>
        <label className="text-sm text-neutral-300">
          Page address
          <input className={`${fieldClass} mt-2`} value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
        </label>
        <label className="text-sm text-neutral-300">
          Description
          <textarea className={`${fieldClass} mt-2 min-h-32`} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="text-sm text-neutral-300">
          Picture
          <span className="mt-1 block text-xs text-neutral-500">Shown above the title on the Exhibitions page.</span>
          {image ? <img className="mt-2 max-h-64 w-full rounded-lg bg-white object-contain" src={image} alt="" /> : null}
          <span className="mt-2 block"><ChooseFile accept="image/*" onPick={(files) => { const file = files[0]; if (!file) return; void uploadCover(file).then(setImage).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Upload failed.")); }} /></span>
        </label>
        <label className="text-sm text-neutral-300">
          Location
          <input className={`${fieldClass} mt-2`} value={locationText} onChange={(event) => setLocationText(event.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-neutral-300">
            Start date
            <input className={`${fieldClass} mt-2`} type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label className="text-sm text-neutral-300">
            End date
            <input className={`${fieldClass} mt-2`} type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
        </div>
        <label className="text-sm text-neutral-300">
          Status
          <select className={`${fieldClass} mt-2`} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="current">Ongoing</option>
            <option value="past">Previous</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input checked={published} type="checkbox" onChange={(event) => setPublished(event.target.checked)} />
          Published
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {notice ? <p className="text-sm text-neutral-300">{notice}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Save exhibition</button>
          {!isNew ? <button className="rounded-lg border border-white/15 px-4 py-2 text-sm" type="button" onClick={() => void remove()}>Delete</button> : null}
        </div>
      </div>
    </form>
  );
}

export function ExhibitionsAdmin() {
  return (
    <Routes>
      <Route index element={<ExhibitionList />} />
      <Route path=":id" element={<ExhibitionEditor />} />
    </Routes>
  );
}
