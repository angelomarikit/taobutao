import { useEffect, useState, type FormEvent } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ChooseFile } from "@/admin/PageEditor";
import { supabase } from "@/lib/supabase";

const fieldClass = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadPortrait(file: File) {
  const path = `artists/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase!.storage.from("gallery").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase!.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

type ArtistRow = {
  id: string;
  name: string;
  slug: string;
  biography: string | null;
  profile_image: string | null;
  status: string;
};

function ArtistList() {
  const [rows, setRows] = useState<ArtistRow[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void supabase!.from("artists").select("id,name,slug,biography,profile_image,status").order("name").then(({ data, error: loadError }) => {
      if (loadError) setError(loadError.message);
      else setRows((data ?? []) as ArtistRow[]);
    });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Artists</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">A published artist appears on the gallery. Opening that artist shows their own page and works.</p>
        </div>
        <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="button" onClick={() => navigate("/admin/artists/new")}>
          Add artist
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <Link key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4" to={`/admin/artists/${row.id}`}>
            <span>
              <span className="block text-sm">{row.name}</span>
              <span className="text-xs capitalize text-neutral-500">{row.status}</span>
            </span>
            <span className="text-xs text-neutral-400">Edit</span>
          </Link>
        ))}
        {!rows.length && !error ? <p className="text-sm text-neutral-500">No artists saved yet. TAO BUTAO remains on the public gallery until you publish artists here.</p> : null}
      </div>
    </div>
  );
}

function ArtistEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [biography, setBiography] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("published");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (isNew || !id) return;
    void supabase!.from("artists").select("name,slug,biography,profile_image,status").eq("id", id).maybeSingle().then(({ data, error: loadError }) => {
      if (loadError || !data) setError(loadError?.message || "Artist not found.");
      else {
        setName(data.name);
        setSlug(data.slug);
        setBiography(data.biography || "");
        setImage(data.profile_image || "");
        setStatus(data.status);
      }
    });
  }, [id, isNew]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const payload = {
      name: name.trim(),
      slug: slugify(slug || name),
      biography: biography.trim() || null,
      profile_image: image || null,
      status,
      featured: false,
    };
    const query = isNew
      ? supabase!.from("artists").insert(payload).select("id").single()
      : supabase!.from("artists").update(payload).eq("id", id).select("id").single();
    const { data, error: saveError } = await query;
    if (saveError || !data) setError(saveError?.message || "Could not save the artist.");
    else {
      setNotice(status === "published" ? "This artist is live on the gallery." : "Saved as a draft. Drafts stay off the public gallery.");
      if (isNew) navigate(`/admin/artists/${data.id}`, { replace: true });
    }
  }

  async function remove() {
    if (isNew || !id || !window.confirm("Delete this artist? Their artworks stay in the gallery without an artist.")) return;
    const { error: deleteError } = await supabase!.from("artists").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else navigate("/admin/artists");
  }

  return (
    <form className="max-w-2xl" onSubmit={(event) => void save(event)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl">{isNew ? "Add artist" : "Edit artist"}</h1>
        <Link className="text-sm text-neutral-400" to="/admin/artists">All artists</Link>
      </div>
      <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5">
        <label className="text-sm text-neutral-300">
          Name
          <input className={`${fieldClass} mt-2`} value={name} onChange={(event) => { setName(event.target.value); if (isNew) setSlug(slugify(event.target.value)); }} required />
        </label>
        <label className="text-sm text-neutral-300">
          Page address
          <input className={`${fieldClass} mt-2`} value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
        </label>
        <label className="text-sm text-neutral-300">
          Biography
          <textarea className={`${fieldClass} mt-2 min-h-32`} value={biography} onChange={(event) => setBiography(event.target.value)} />
        </label>
        <label className="text-sm text-neutral-300">
          Portrait
          {image ? <img className="mt-2 max-h-40 rounded-lg object-contain" src={image} alt="" /> : null}
          <span className="mt-2 block"><ChooseFile accept="image/*" onPick={(files) => { const file = files[0]; if (!file) return; void uploadPortrait(file).then(setImage).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Upload failed.")); }} /></span>
        </label>
        <label className="text-sm text-neutral-300">
          Visibility
          <select className={`${fieldClass} mt-2`} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {notice ? <p className="text-sm text-neutral-300">{notice}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Save artist</button>
          {!isNew ? <button className="rounded-lg border border-white/15 px-4 py-2 text-sm" type="button" onClick={() => void remove()}>Delete</button> : null}
        </div>
      </div>
    </form>
  );
}

export function ArtistsAdmin() {
  return (
    <Routes>
      <Route index element={<ArtistList />} />
      <Route path=":id" element={<ArtistEditor />} />
    </Routes>
  );
}
