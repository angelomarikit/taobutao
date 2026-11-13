import { useEffect, useState, type FormEvent } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ChooseFile } from "@/admin/PageEditor";
import { supabase } from "@/lib/supabase";

const fieldClass = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadImage(file: File, folder: string) {
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase!.storage.from("gallery").upload(path, file, { upsert: false });
  if (error) throw error;
  return supabase!.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}

type AuctionRow = {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  start_date: string | null;
  status: string;
  published: boolean;
};

type LotRow = {
  id: string;
  lot_number: number;
  artist_name: string | null;
  title: string;
  image_url: string | null;
  price: number | null;
  currency: string;
};

function AuctionList() {
  const [rows, setRows] = useState<AuctionRow[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void supabase!.from("auctions").select("id,title,slug,cover_image,start_date,status,published").order("start_date", { ascending: false }).then(({ data, error: loadError }) => {
      if (loadError) setError(loadError.message);
      else setRows((data ?? []) as AuctionRow[]);
    });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Auctions</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">Published auctions appear on the public Auctions page. Lots, pictures, and prices are added on each auction.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to="/auctions">View page</Link>
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="button" onClick={() => navigate("/admin/auctions/new")}>Add auction</button>
        </div>
      </div>
      {error ? <p className="mt-4 max-w-xl text-sm text-red-300">{error.includes("auctions") ? "Run supabase/migrations/004_auctions.sql in the Supabase SQL editor, then reload this page." : error}</p> : null}
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <Link key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4" to={`/admin/auctions/${row.id}`}>
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
        {!rows.length && !error ? <p className="text-sm text-neutral-500">No auctions saved yet.</p> : null}
      </div>
    </div>
  );
}

function AuctionEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [published, setPublished] = useState(true);
  const [lots, setLots] = useState<LotRow[]>([]);
  const [lotNumber, setLotNumber] = useState("");
  const [artistName, setArtistName] = useState("");
  const [lotTitle, setLotTitle] = useState("");
  const [lotImage, setLotImage] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("PHP");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadLots(auctionId: string) {
    const { data, error: loadError } = await supabase!.from("auction_lots").select("id,lot_number,artist_name,title,image_url,price,currency").eq("auction_id", auctionId).order("lot_number");
    if (loadError) setError(loadError.message);
    else setLots((data ?? []) as LotRow[]);
  }

  useEffect(() => {
    if (isNew || !id) return;
    void supabase!.from("auctions").select("title,slug,description,cover_image,location,start_date,end_date,status,published").eq("id", id).maybeSingle().then(({ data, error: loadError }) => {
      if (loadError || !data) setError(loadError?.message || "Auction not found.");
      else {
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || "");
        setImage(data.cover_image || "");
        setLocation(data.location || "");
        setStartDate(data.start_date || "");
        setEndDate(data.end_date || "");
        setStatus(data.status);
        setPublished(Boolean(data.published));
      }
    });
    void loadLots(id);
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
      location: location.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      status,
      published,
    };
    const query = isNew
      ? supabase!.from("auctions").insert(payload).select("id").single()
      : supabase!.from("auctions").update(payload).eq("id", id).select("id").single();
    const { data, error: saveError } = await query;
    if (saveError || !data) setError(saveError?.message || "Could not save the auction.");
    else {
      setNotice(published ? "Saved in Supabase. This auction is live." : "Saved in Supabase as a draft.");
      if (isNew) navigate(`/admin/auctions/${data.id}`, { replace: true });
    }
  }

  async function addLot(event: FormEvent) {
    event.preventDefault();
    if (!id || isNew) return;
    setError("");
    const amount = price.trim() === "" ? null : Number(price);
    if (amount != null && Number.isNaN(amount)) {
      setError("Enter a price as a number, or leave it blank.");
      return;
    }
    const { error: saveError } = await supabase!.from("auction_lots").insert({
      auction_id: id,
      lot_number: Number(lotNumber),
      artist_name: artistName.trim() || null,
      title: lotTitle.trim(),
      image_url: lotImage || null,
      price: amount,
      currency: currency.trim().toUpperCase() || "PHP",
      display_order: Number(lotNumber) || 0,
    });
    if (saveError) setError(saveError.message);
    else {
      setLotNumber("");
      setArtistName("");
      setLotTitle("");
      setLotImage("");
      setPrice("");
      await loadLots(id);
    }
  }

  async function removeLot(lotId: string) {
    if (!id || !window.confirm("Delete this lot?")) return;
    const { error: deleteError } = await supabase!.from("auction_lots").delete().eq("id", lotId);
    if (deleteError) setError(deleteError.message);
    else await loadLots(id);
  }

  async function removeAuction() {
    if (isNew || !id || !window.confirm("Delete this auction and its lots?")) return;
    const { error: deleteError } = await supabase!.from("auctions").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else navigate("/admin/auctions");
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={(event) => void save(event)}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-2xl">{isNew ? "Add auction" : "Edit auction"}</h1>
          <Link className="text-sm text-neutral-400" to="/admin/auctions">All auctions</Link>
        </div>
        <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5">
          <label className="text-sm text-neutral-300">Title<input className={`${fieldClass} mt-2`} value={title} onChange={(event) => { setTitle(event.target.value); if (isNew) setSlug(slugify(event.target.value)); }} required /></label>
          <label className="text-sm text-neutral-300">Page address<input className={`${fieldClass} mt-2`} value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required /></label>
          <label className="text-sm text-neutral-300">Description<textarea className={`${fieldClass} mt-2 min-h-24`} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label className="text-sm text-neutral-300">
            Cover
            {image ? <img className="mt-2 max-h-64 w-full rounded-lg bg-white object-contain" src={image} alt="" /> : null}
            <span className="mt-2 block"><ChooseFile accept="image/*" onPick={(files) => { const file = files[0]; if (!file) return; void uploadImage(file, "auctions").then(setImage).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Upload failed.")); }} /></span>
          </label>
          <label className="text-sm text-neutral-300">Location<input className={`${fieldClass} mt-2`} value={location} onChange={(event) => setLocation(event.target.value)} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-neutral-300">Start date<input className={`${fieldClass} mt-2`} type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label className="text-sm text-neutral-300">End date<input className={`${fieldClass} mt-2`} type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
          </div>
          <label className="text-sm text-neutral-300">
            Status
            <select className={`${fieldClass} mt-2`} value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="previous">Previous</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300"><input checked={published} type="checkbox" onChange={(event) => setPublished(event.target.checked)} />Published</label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {notice ? <p className="text-sm text-neutral-300">{notice}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Save auction</button>
            {!isNew ? <button className="rounded-lg border border-white/15 px-4 py-2 text-sm" type="button" onClick={() => void removeAuction()}>Delete</button> : null}
          </div>
        </div>
      </form>

      {!isNew && id ? (
        <div className="mt-8">
          <h2 className="text-xl">Lots</h2>
          <div className="mt-4 grid gap-3">
            {lots.map((lot) => (
              <div key={lot.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
                <span className="flex min-w-0 items-center gap-4">
                  {lot.image_url ? <img className="h-16 w-16 shrink-0 bg-white object-cover" src={lot.image_url} alt="" /> : <span className="h-16 w-16 shrink-0 bg-white/10" />}
                  <span className="min-w-0">
                    <span className="block text-sm">Lot {lot.lot_number} · {lot.title}</span>
                    <span className="text-xs text-neutral-500">{lot.artist_name || "No artist"}{lot.price != null ? ` · ${lot.currency} ${lot.price}` : ""}</span>
                  </span>
                </span>
                <button className="text-xs text-neutral-400" type="button" onClick={() => void removeLot(lot.id)}>Delete</button>
              </div>
            ))}
          </div>
          <form className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5" onSubmit={(event) => void addLot(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-neutral-300">Lot number<input className={`${fieldClass} mt-2`} inputMode="numeric" value={lotNumber} onChange={(event) => setLotNumber(event.target.value)} required /></label>
              <label className="text-sm text-neutral-300">Artist<input className={`${fieldClass} mt-2`} value={artistName} onChange={(event) => setArtistName(event.target.value)} /></label>
            </div>
            <label className="text-sm text-neutral-300">Title<input className={`${fieldClass} mt-2`} value={lotTitle} onChange={(event) => setLotTitle(event.target.value)} required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-neutral-300">Price<input className={`${fieldClass} mt-2`} inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
              <label className="text-sm text-neutral-300">Currency<input className={`${fieldClass} mt-2`} maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} /></label>
            </div>
            <label className="text-sm text-neutral-300">
              Picture
              {lotImage ? <img className="mt-2 max-h-40 rounded-lg bg-white object-contain" src={lotImage} alt="" /> : null}
              <span className="mt-2 block"><ChooseFile accept="image/*" onPick={(files) => { const file = files[0]; if (!file) return; void uploadImage(file, "auction-lots").then(setLotImage).catch((caught: unknown) => setError(caught instanceof Error ? caught.message : "Upload failed.")); }} /></span>
            </label>
            <button className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Add lot</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function AuctionsAdmin() {
  return (
    <Routes>
      <Route index element={<AuctionList />} />
      <Route path=":id" element={<AuctionEditor />} />
    </Routes>
  );
}
