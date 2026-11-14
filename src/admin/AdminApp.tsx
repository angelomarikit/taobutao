import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { galleryName, socialLinks } from "@/data/reference";
import { ArtistsAdmin } from "@/admin/ArtistsAdmin";
import { AuctionsAdmin } from "@/admin/AuctionsAdmin";
import { AssistantAdmin } from "@/admin/AssistantAdmin";
import { ExhibitionsAdmin } from "@/admin/ExhibitionsAdmin";
import { FooterAdmin } from "@/admin/FooterAdmin";
import { PageEditor, ChooseFile } from "@/admin/PageEditor";
import { aboutSections, contactSections, gallerySections, homeSections, journalSections, settingFields } from "@/admin/pageCatalog";
import { siteOrigin, supabase, supabaseConfigured, supabaseProjectHost } from "@/lib/supabase";

type SessionState = {
  ready: boolean;
  email: string | null;
  userId: string | null;
  isAdmin: boolean;
  fullName: string | null;
  role: string | null;
  profileError: string | null;
};

const emptySession: SessionState = {
  ready: false,
  email: null,
  userId: null,
  isAdmin: false,
  fullName: null,
  role: null,
  profileError: null,
};

function useAdminSession() {
  const [session, setSession] = useState<SessionState>(emptySession);

  useEffect(() => {
    if (!supabase) {
      setSession({ ...emptySession, ready: true });
      return;
    }
    let ignore = false;
    async function read() {
      const { data } = await supabase!.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        if (!ignore) setSession({ ...emptySession, ready: true });
        return;
      }
      const { data: profile, error } = await supabase!
        .from("admin_profiles")
        .select("role, full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!ignore) {
        setSession({
          ready: true,
          email: user.email ?? null,
          userId: user.id,
          isAdmin: Boolean(profile),
          fullName: profile?.full_name ?? null,
          role: profile?.role ?? null,
          profileError: error?.message ?? null,
        });
      }
    }
    void read();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      void read();
    });
    return () => {
      ignore = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return session;
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navIcon = {
  dashboard: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z",
  home: "M4 11.5 12 4l8 7.5M6 10.5V20h12v-9.5",
  about: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0",
  gallery: "M4 6h16v12H4zM4 15l4-4 3 3 2-2 5 5",
  journal: "M7 4h10a1 1 0 0 1 1 1v14l-6-3-6 3V5a1 1 0 0 1 1-1Z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  assistant: "M5 16.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H9l-4 3.5Z",
  media: "M4 6h16v12H4zM9 10h.01M9 14l2.5-2.5L15 15",
  settings: "M12 15.5a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 15.5ZM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4",
  footer: "M4 5h16M4 10h16M4 15h10M4 20h16",
};

function SideLink({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <NavLink
      end={end}
      to={to}
      className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white" : "hover:bg-white/5"}`}
      style={({ isActive }) => ({ color: isActive ? "#111111" : "#d4d4d4" })}
    >
      {children}
    </NavLink>
  );
}

function Shell({
  email,
  fullName,
  role,
  children,
}: {
  email: string;
  fullName: string | null;
  role: string | null;
  children: ReactNode;
}) {
  const location = useLocation();
  const onGalleryRoute = location.pathname.startsWith("/admin/artworks") || location.pathname.startsWith("/admin/gallery") || location.pathname.startsWith("/admin/artists");
  const [galleryPinned, setGalleryPinned] = useState<boolean | null>(null);
  useEffect(() => {
    setGalleryPinned(null);
  }, [onGalleryRoute]);
  const galleryOpen = galleryPinned ?? onGalleryRoute;
  const displayName = fullName || email.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white" style={{ fontFamily: "Inter, sans-serif", colorScheme: "dark" }}>
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="flex flex-col border-r border-white/10 bg-[#090909] px-4 py-6">
          <div className="px-2">
            <p className="text-sm font-semibold tracking-[0.14em] uppercase">{galleryName}</p>
            <p className="mt-1 text-xs text-neutral-500">Art Gallery CMS</p>
          </div>
          <nav className="mt-8 space-y-1">
            <SideLink end to="/admin"><Icon d={navIcon.dashboard} />Dashboard</SideLink>
            <SideLink to="/admin/home"><Icon d={navIcon.home} />Home Page</SideLink>
            <SideLink to="/admin/about"><Icon d={navIcon.about} />About Page</SideLink>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5" style={{ color: "#d4d4d4" }} type="button" aria-expanded={galleryOpen} onClick={() => setGalleryPinned(!galleryOpen)}>
              <Icon d={navIcon.gallery} />Gallery
              <span className="ml-auto text-xs">{galleryOpen ? "–" : "+"}</span>
            </button>
            {galleryOpen ? (
              <div className="space-y-1 pl-7">
                <SideLink end to="/admin/gallery">Page intro</SideLink>
                <SideLink to="/admin/artists">Artists</SideLink>
                <SideLink to="/admin/artworks">Artworks</SideLink>
                <SideLink to="/admin/gallery/collections">Collections</SideLink>
              </div>
            ) : null}
            <SideLink to="/admin/auctions"><Icon d={navIcon.gallery} />Auctions</SideLink>
            <SideLink to="/admin/exhibitions"><Icon d={navIcon.journal} />Exhibitions</SideLink>
            <SideLink to="/admin/journal"><Icon d={navIcon.journal} />Journal</SideLink>
            <SideLink to="/admin/inquiries"><Icon d={navIcon.mail} />Contact / Enquiries</SideLink>
            <SideLink to="/admin/assistant"><Icon d={navIcon.assistant} />Assistant</SideLink>
            <SideLink to="/admin/media"><Icon d={navIcon.media} />Media Library</SideLink>
            <SideLink to="/admin/footer"><Icon d={navIcon.footer} />Footer</SideLink>
            <SideLink to="/admin/settings"><Icon d={navIcon.settings} />Site Settings</SideLink>
          </nav>
          <div className="mt-auto flex items-center gap-3 px-2 pt-8">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-semibold text-black">
              {displayName.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm">{displayName}</p>
              <p className="text-xs capitalize text-neutral-500">{role || "Administrator"}</p>
            </div>
          </div>
          <button className="mt-4 px-2 text-left text-xs text-neutral-500" type="button" onClick={() => supabase?.auth.signOut()}>
            Sign out
          </button>
        </aside>
        <div className="min-w-0 p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm text-neutral-300">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500";

const loginInput = "w-full rounded-xl border border-white/15 bg-transparent py-3 pr-4 pl-11 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/40";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const { error: signInError } = await supabase!.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      return;
    }
    if (!remember) {
      const key = Object.keys(localStorage).find((item) => item.startsWith("sb-") && item.endsWith("-auth-token"));
      if (key) localStorage.removeItem(key);
    }
  }

  async function forgotPassword() {
    setError("");
    setNotice("");
    if (!email) {
      setError("Enter your email address, then choose Forgot password.");
      return;
    }
    const { error: resetError } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteOrigin()}/admin`,
    });
    if (resetError) setError(resetError.message);
    else setNotice("Password reset email sent.");
  }

  return (
    <main className="grid min-h-screen bg-[#0c0c0e] text-white lg:grid-cols-2" style={{ fontFamily: "Inter, sans-serif" }}>
      <section className="relative min-h-[280px] overflow-hidden lg:min-h-screen">
        <img
          className="pointer-events-none absolute top-0 left-1/2"
          style={{ height: "700%", width: "auto", maxWidth: "none", transform: "translate(-50%, -35.5%)" }}
          src="/media/about-black-pair.jpg"
          alt=""
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative flex h-full flex-col justify-center px-10 py-16 text-white lg:px-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">{galleryName}</h1>
          <p className="mt-4 text-sm tracking-[0.42em] text-white/90">ART GALLERY CMS</p>
          <span className="mt-6 block h-px w-16 bg-white/70" />
          <p className="mt-8 max-w-[280px] text-sm leading-6 text-white/85">
            Manage artworks, collections, exhibitions, and website content.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <form className="w-full max-w-[420px]" onSubmit={(event) => void onSubmit(event)}>
          <h2 className="text-4xl font-semibold tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-neutral-400">Sign in to access the gallery administration.</p>
          <label className="relative mt-8 block">
            <span className="sr-only">Email Address</span>
            <MailIcon />
            <input className={loginInput} type="email" placeholder="Email Address" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="relative mt-4 block">
            <span className="sr-only">Password</span>
            <LockIcon />
            <input className={`${loginInput} pr-12`} type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
              <EyeIcon off={showPassword} />
            </button>
          </label>
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
            <label className="flex items-center gap-2">
              <input className="h-4 w-4 accent-white" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
              Remember me
            </label>
            <button className="text-neutral-300" type="button" onClick={() => void forgotPassword()}>Forgot password?</button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          {notice ? <p className="mt-4 text-sm text-neutral-300">{notice}</p> : null}
          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black" type="submit">
            Sign In <span aria-hidden="true">→</span>
          </button>
          <div className="mt-10 flex items-center gap-4 text-[11px] tracking-[0.18em] text-neutral-500">
            <span className="h-px flex-1 bg-white/15" />
            {galleryName}
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a key={link.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white" href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                {link.label === "Instagram" ? <InstagramIcon /> : <FacebookIcon />}
              </a>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
}

function MailIcon() {
  return (
    <svg className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      {off ? <path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.6" /> : null}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7Z" />
    </svg>
  );
}

function Setup() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0c0e] px-6 text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-xl rounded-2xl border border-white/10 bg-[#141416] p-8">
        <p className="text-sm font-semibold tracking-[0.14em] uppercase">{galleryName}</p>
        <h1 className="mt-3 text-2xl">Connect Supabase before using the admin.</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-400">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.
          Run supabase/migrations/001_schema.sql, then 002_cms_collections.sql, in the Supabase SQL editor.
          Create an Auth user, then insert that user into admin_profiles.
        </p>
        <Link className="mt-6 inline-block text-sm underline" to="/">Back to the site</Link>
      </div>
    </main>
  );
}

function Dashboard({ name }: { name: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [artworks, setArtworks] = useState<Array<Record<string, string>>>([]);
  const [posts, setPosts] = useState<Array<Record<string, string>>>([]);
  const [enquiries, setEnquiries] = useState<Array<Record<string, string>>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const [artworksCount, postsCount, fresh, collectionsCount] = await Promise.all([
        supabase!.from("artworks").select("*", { count: "exact", head: true }),
        supabase!.from("journal_posts").select("*", { count: "exact", head: true }),
        supabase!.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase!.from("gallery_collections").select("*", { count: "exact", head: true }),
      ]);
      const failed = artworksCount.error || postsCount.error || fresh.error;
      if (failed) setError(failed.message);
      setCounts({
        artworks: artworksCount.count ?? 0,
        posts: postsCount.count ?? 0,
        newInquiries: fresh.count ?? 0,
        collections: collectionsCount.error ? 0 : collectionsCount.count ?? 0,
      });
      const latestArt = await supabase!.from("artworks").select("id,title,medium").order("created_at", { ascending: false }).limit(3);
      const latestPosts = await supabase!.from("journal_posts").select("id,title,published,published_on,featured_image").order("created_at", { ascending: false }).limit(2);
      const latestMail = await supabase!.from("inquiries").select("id,name,email,subject,status,created_at").order("created_at", { ascending: false }).limit(3);
      if (!latestArt.error) setArtworks((latestArt.data ?? []) as Array<Record<string, string>>);
      if (!latestPosts.error) setPosts((latestPosts.data ?? []) as Array<Record<string, string>>);
      if (!latestMail.error) setEnquiries((latestMail.data ?? []) as Array<Record<string, string>>);
    }
    void load();
  }, []);

  const stats = [
    ["Total Artworks", counts.artworks],
    ["Journal Posts", counts.posts],
    ["New Enquiries", counts.newInquiries],
    ["Collections", counts.collections],
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, {name}</h1>
          <p className="mt-2 text-sm text-neutral-400">Manage your art gallery website, artworks, and updates.</p>
        </div>
        <Link className="rounded-full border border-white/15 px-4 py-2 text-sm text-white" to="/">View Website</Link>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <p className="text-sm text-neutral-400">{label}</p>
            <p className="mt-4 text-4xl font-semibold">{value ?? "—"}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-2xl border border-white/10 bg-[#141416] p-5">
          <h2 className="text-base font-medium">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["/admin/artworks/new", "Add Artwork"],
              ["/admin/journal", "New Journal"],
              ["/admin/home", "Update Home"],
              ["/admin/settings", "Site Settings"],
            ].map(([to, label]) => (
              <Link key={label} className="grid min-h-24 place-items-center rounded-xl border border-white/10 bg-black/30 text-sm" to={to}>
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-base font-medium">Latest Artworks</h2>
            <Link className="text-xs text-neutral-400" to="/admin/artworks">View All</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {artworks.length ? artworks.map((row) => (
              <Link key={row.id} className="rounded-xl border border-white/10 p-3" to={`/admin/artworks/${row.id}`}>
                <p className="text-sm">{row.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{row.medium || "Artwork"}</p>
              </Link>
            )) : <p className="text-sm text-neutral-500">No artworks saved yet.</p>}
          </div>
        </section>
        <div className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Recent Enquiries</h2>
              <Link className="text-xs text-neutral-400" to="/admin/inquiries">View All</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {enquiries.length ? enquiries.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="block">{row.subject || row.name}</span>
                    <span className="text-xs text-neutral-500">{row.email}</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] capitalize">{row.status}</span>
                </li>
              )) : <li className="text-sm text-neutral-500">No enquiries yet.</li>}
            </ul>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Recent Journal Posts</h2>
              <Link className="text-xs text-neutral-400" to="/admin/journal">View All</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {posts.length ? posts.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{row.title}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-300">{row.published ? "Published" : "Draft"}</span>
                </li>
              )) : <li className="text-sm text-neutral-500">No journal posts saved yet.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uploadImage(file: File, folder: string) {
  const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
  const { error } = await supabase!.storage.from("gallery").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase!.storage.from("gallery").getPublicUrl(path);
  return data.publicUrl;
}

function Artworks() {
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    const { data, error: loadError } = await supabase!
      .from("artworks")
      .select("id,title,slug,availability_status,published,featured")
      .order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as Array<Record<string, string>>);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Artworks</h1>
        <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="button" onClick={() => navigate("/admin/artworks/new")}>
          New artwork
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm text-white">
          <thead className="border-b border-white/10 text-xs uppercase text-neutral-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Published</th>
              <th className="p-3">Featured</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/10">
                <td className="p-3"><Link className="underline" to={`/admin/artworks/${row.id}`}>{row.title}</Link></td>
                <td className="p-3">{row.availability_status}</td>
                <td className="p-3">{String(row.published)}</td>
                <td className="p-3">{String(row.featured)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArtworkEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<Array<{ id?: string; image_url: string; alt_text: string; display_order: number; is_primary: boolean }>>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    artist_id: "",
    category_id: "",
    description: "",
    medium: "",
    year_created: "",
    width: "",
    height: "",
    depth: "",
    dimensions_unit: "cm",
    price: "",
    currency: "USD",
    availability_status: "available",
    featured: false,
    published: false,
  });

  useEffect(() => {
    async function load() {
      const [artistResult, categoryResult] = await Promise.all([
        supabase!.from("artists").select("id,name").order("name"),
        supabase!.from("artwork_categories").select("id,name").order("name"),
      ]);
      setArtists(artistResult.data ?? []);
      setCategories(categoryResult.data ?? []);
      if (!isNew && id) {
        const { data, error: loadError } = await supabase!.from("artworks").select("*").eq("id", id).single();
        if (loadError) setError(loadError.message);
        if (data) {
          setForm({
            title: data.title ?? "",
            slug: data.slug ?? "",
            artist_id: data.artist_id ?? "",
            category_id: data.category_id ?? "",
            description: data.description ?? "",
            medium: data.medium ?? "",
            year_created: data.year_created?.toString() ?? "",
            width: data.width?.toString() ?? "",
            height: data.height?.toString() ?? "",
            depth: data.depth?.toString() ?? "",
            dimensions_unit: data.dimensions_unit ?? "cm",
            price: data.price?.toString() ?? "",
            currency: data.currency ?? "USD",
            availability_status: data.availability_status ?? "available",
            featured: Boolean(data.featured),
            published: Boolean(data.published),
          });
        }
        const imageResult = await supabase!.from("artwork_images").select("*").eq("artwork_id", id).order("display_order");
        setImages(imageResult.data ?? []);
      }
    }
    void load();
  }, [id, isNew]);

  function update(key: string, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      artist_id: form.artist_id || null,
      category_id: form.category_id || null,
      description: form.description,
      medium: form.medium,
      year_created: form.year_created ? Number(form.year_created) : null,
      width: form.width ? Number(form.width) : null,
      height: form.height ? Number(form.height) : null,
      depth: form.depth ? Number(form.depth) : null,
      dimensions_unit: form.dimensions_unit,
      price: form.price ? Number(form.price) : null,
      currency: form.currency,
      availability_status: form.availability_status,
      featured: form.featured,
      published: form.published,
      updated_at: new Date().toISOString(),
    };
    const result = isNew
      ? await supabase!.from("artworks").insert(payload).select("id").single()
      : await supabase!.from("artworks").update(payload).eq("id", id).select("id").single();
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    const artworkId = result.data.id as string;
    if (images.length) {
      await supabase!.from("artwork_images").delete().eq("artwork_id", artworkId);
      await supabase!.from("artwork_images").insert(
        images.map((image, index) => ({
          artwork_id: artworkId,
          image_url: image.image_url,
          alt_text: image.alt_text,
          display_order: index,
          is_primary: image.is_primary,
        })),
      );
    }
    navigate("/admin/artworks");
  }

  async function onFile(file: File) {
    try {
      const url = await uploadImage(file, "artworks");
      setImages((current) => [
        ...current,
        { image_url: url, alt_text: form.title, display_order: current.length, is_primary: current.length === 0 },
      ]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    }
  }

  async function remove() {
    if (!id || !confirm("Delete this artwork?")) return;
    const { error: deleteError } = await supabase!.from("artworks").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else navigate("/admin/artworks");
  }

  return (
    <form className="max-w-3xl space-y-4" onSubmit={save}>
      <h1 className="text-2xl">{isNew ? "New artwork" : "Edit artwork"}</h1>
      <Field label="Title"><input className={inputClass} value={form.title} onChange={(event) => update("title", event.target.value)} required /></Field>
      <Field label="Slug"><input className={inputClass} value={form.slug} onChange={(event) => update("slug", event.target.value)} /></Field>
      <Field label="Artist">
        <select className={inputClass} value={form.artist_id} onChange={(event) => update("artist_id", event.target.value)}>
          <option value="">Unassigned</option>
          {artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
        </select>
      </Field>
      <Field label="Category">
        <select className={inputClass} value={form.category_id} onChange={(event) => update("category_id", event.target.value)}>
          <option value="">None</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </Field>
      <Field label="Description"><textarea className={inputClass} rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} /></Field>
      <Field label="Medium"><input className={inputClass} value={form.medium} onChange={(event) => update("medium", event.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Field label="Year"><input className={inputClass} value={form.year_created} onChange={(event) => update("year_created", event.target.value)} /></Field>
        <Field label="Width"><input className={inputClass} value={form.width} onChange={(event) => update("width", event.target.value)} /></Field>
        <Field label="Height"><input className={inputClass} value={form.height} onChange={(event) => update("height", event.target.value)} /></Field>
        <Field label="Depth"><input className={inputClass} value={form.depth} onChange={(event) => update("depth", event.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Unit"><input className={inputClass} value={form.dimensions_unit} onChange={(event) => update("dimensions_unit", event.target.value)} /></Field>
        <Field label="Price"><input className={inputClass} value={form.price} onChange={(event) => update("price", event.target.value)} /></Field>
        <Field label="Currency"><input className={inputClass} value={form.currency} onChange={(event) => update("currency", event.target.value)} /></Field>
      </div>
      <Field label="Availability">
        <select className={inputClass} value={form.availability_status} onChange={(event) => update("availability_status", event.target.value)}>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Featured</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(event) => update("published", event.target.checked)} /> Published</label>
      <div>
        <p className="mb-2 text-sm text-neutral-300">Images</p>
        <ChooseFile accept="image/jpeg,image/png,image/webp" onPick={(files) => { if (files[0]) void onFile(files[0]); }} />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <figure key={image.image_url} className="bg-white p-2">
              <img className="h-28 w-full object-cover" src={image.image_url} alt={image.alt_text} />
              <button className="mt-2 text-xs underline" type="button" onClick={() => setImages((current) => current.map((item, itemIndex) => ({ ...item, is_primary: itemIndex === index })))}>
                {image.is_primary ? "Primary" : "Make primary"}
              </button>
              <div className="mt-1 flex gap-2 text-xs">
                <button type="button" onClick={() => setImages((current) => moveImage(current, index, -1))}>Up</button>
                <button type="button" onClick={() => setImages((current) => moveImage(current, index, 1))}>Down</button>
              </div>
            </figure>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex gap-3">
        <button className="bg-black px-4 py-2 text-sm text-white" disabled={saving} type="submit">{saving ? "Saving" : "Save"}</button>
        {!isNew ? <button className="border border-red-700 px-4 py-2 text-sm text-red-700" type="button" onClick={() => void remove()}>Delete</button> : null}
      </div>
    </form>
  );
}

function moveImage<T>(items: T[], index: number, direction: -1 | 1) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

function CollectionEditor({
  table,
  title,
  fields,
}: {
  table: "artists" | "exhibitions" | "journal_posts" | "artwork_categories";
  title: string;
  fields: string[];
}) {
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function load() {
    const { data, error: loadError } = await supabase!.from(table).select("*").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as Array<Record<string, string>>);
  }

  useEffect(() => {
    void load();
  }, [table]);

  async function save(event: FormEvent) {
    event.preventDefault();
    const payload: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries(draft)) {
      if (value !== "") payload[key] = value;
    }
    if (!payload.slug && typeof payload.name === "string") payload.slug = slugify(payload.name);
    if (!payload.slug && typeof payload.title === "string") payload.slug = slugify(payload.title);
    if ((table === "exhibitions" || table === "journal_posts") && payload.published === undefined) payload.published = false;
    const { error: saveError } = await supabase!.from(table).insert(payload);
    if (saveError) setError(saveError.message);
    else {
      setDraft({});
      await load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    const { error: deleteError } = await supabase!.from(table).delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  return (
    <div>
      <h1 className="text-2xl">{title}</h1>
      <form className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-5 md:grid-cols-2" onSubmit={save}>
        {fields.map((field) => (
          <Field key={field} label={field}>
            {field === "biography" || field === "description" || field === "content" ? (
              <textarea className={inputClass} rows={4} value={draft[field] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field]: event.target.value }))} />
            ) : (
              <input className={inputClass} value={draft[field] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field]: event.target.value }))} />
            )}
          </Field>
        ))}
        <button className="w-fit rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="submit">Add</button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <ul className="mt-6 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm">
            <span>{row.title || row.name || row.key}</span>
            <button className="text-red-700" type="button" onClick={() => void remove(row.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Inquiries() {
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  async function load() {
    const { data, error: loadError } = await supabase!.from("inquiries").select("*").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as Array<Record<string, string>>);
  }

  useEffect(() => {
    void load();
  }, []);

  const visible = useMemo(
    () =>
      rows.filter((row) => {
        const matchesStatus = status === "all" || row.status === status;
        const haystack = `${row.name} ${row.email} ${row.phone} ${row.subject} ${row.message}`.toLowerCase();
        return matchesStatus && haystack.includes(query.toLowerCase());
      }),
    [query, rows, status],
  );

  async function setRowStatus(id: string, next: string) {
    const { error: updateError } = await supabase!.from("inquiries").update({ status: next }).eq("id", id);
    if (updateError) setError(updateError.message);
    else await load();
  }

  return (
    <div>
      <h1 className="text-2xl">Enquiries</h1>
      <div className="mt-4 flex gap-3">
        <input className={inputClass} placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          {["all", "new", "contacted", "resolved", "closed"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 space-y-3">
        {visible.map((row) => (
          <article key={row.id} className="rounded-xl border border-white/10 bg-[#141416] p-4 text-sm text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <strong>{row.name}</strong>
              <span>{row.email}</span>
              {row.phone ? <span>{row.phone}</span> : null}
              <span>{row.inquiry_type}</span>
              <select className={`${inputClass} w-auto`} value={row.status} onChange={(event) => void setRowStatus(row.id, event.target.value)}>
                {["new", "contacted", "resolved", "closed"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <p className="mt-2 text-neutral-300">{row.subject}</p>
            <p className="mt-2">{row.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function JournalAdmin() {
  return (
    <div className="space-y-12">
      <PageEditor page="journal" title="Journal page" publicPath="/journal" sections={journalSections} />
      <CollectionEditor table="journal_posts" title="Journal posts" fields={["title", "slug", "category", "author", "role", "excerpt", "hero_heading", "featured_image", "content"]} />
    </div>
  );
}

function ContactAdmin() {
  return (
    <div className="space-y-12">
      <PageEditor page="contact" title="Contact" publicPath="/" sections={contactSections} />
      <Inquiries />
    </div>
  );
}

function Collections() {
  const [rows, setRows] = useState<Array<Record<string, string | number | boolean>>>([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  async function load() {
    const { data, error: loadError } = await supabase!.from("gallery_collections").select("*").order("display_order");
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as Array<Record<string, string | number | boolean>>);
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setError("");
    const slug = slugify(title);
    let cover = "";
    if (files[0]) cover = await uploadImage(files[0], "collections");
    const { data, error: saveError } = await supabase!
      .from("gallery_collections")
      .insert({ title, slug, description, cover_image: cover || null, status: "draft" })
      .select("id")
      .single();
    if (saveError || !data) {
      setError(saveError?.message || "Could not save the collection.");
      return;
    }
    if (files.length) {
      const images = [];
      for (const [index, file] of files.entries()) {
        const image_url = index === 0 && cover ? cover : await uploadImage(file, "collections");
        images.push({ collection_id: data.id, image_url, display_order: index, alt_text: title });
      }
      const { error: imageError } = await supabase!.from("collection_images").insert(images);
      if (imageError) setError(imageError.message);
    }
    setTitle("");
    setDescription("");
    setFiles([]);
    await load();
  }

  async function setStatus(id: string, status: string) {
    const { error: updateError } = await supabase!.from("gallery_collections").update({ status }).eq("id", id);
    if (updateError) setError(updateError.message);
    else await load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this collection and its image records?")) return;
    const { error: deleteError } = await supabase!.from("gallery_collections").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  return (
    <div>
      <h1 className="text-2xl">Collections</h1>
      <p className="mt-2 text-sm text-neutral-400">Published collections appear on the public gallery. Drafts stay private.</p>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <form className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-5" onSubmit={(event) => void create(event)}>
        <input className={inputClass} placeholder="Collection title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <textarea className={`${inputClass} min-h-24`} placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <ChooseFile accept="image/*" multiple onPick={setFiles} />
        <button className="w-fit rounded-lg bg-white px-4 py-2 text-sm text-black" type="submit">Add collection</button>
      </form>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <article key={String(row.id)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4 text-sm">
            <div>
              <p className="font-medium">{String(row.title)}</p>
              <p className="text-xs capitalize text-neutral-500">{String(row.status)}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-white/15 px-3 py-1" type="button" onClick={() => void setStatus(String(row.id), row.status === "published" ? "draft" : "published")}>
                {row.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button className="rounded-lg border border-white/15 px-3 py-1" type="button" onClick={() => void remove(String(row.id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MediaLibrary() {
  const [rows, setRows] = useState<Array<{ id: string; label: string | null; public_url: string }>>([]);
  const [error, setError] = useState("");

  async function load() {
    const { data, error: loadError } = await supabase!.from("media_assets").select("id,label,public_url").order("created_at", { ascending: false });
    if (loadError) setError(loadError.message);
    else setRows(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(file: File) {
    setError("");
    try {
      const public_url = await uploadImage(file, "library");
      const path = public_url.split("/gallery/")[1] || file.name;
      const { error: saveError } = await supabase!.from("media_assets").insert({ path, public_url, label: file.name, mime_type: file.type });
      if (saveError) setError(saveError.message);
      else await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl">Media Library</h1>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      <ChooseFile accept="image/*,video/*" onPick={(files) => { if (files[0]) void upload(files[0]); }} />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <figure key={row.id} className="overflow-hidden rounded-xl border border-white/10">
            <img className="h-40 w-full object-contain" src={row.public_url} alt={row.label || ""} />
            <figcaption className="truncate p-3 text-xs text-neutral-400">{row.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    void supabase!.from("site_settings").select("key,value").then(({ data, error: loadError }) => {
      if (loadError) setError(loadError.message);
      else {
        const next: Record<string, string> = {};
        for (const row of data ?? []) next[row.key] = row.value;
        setValues(next);
      }
    });
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const rows = settingFields.map((field) => ({
      key: field.key,
      value: values[field.key] ?? field.fallback,
      updated_at: new Date().toISOString(),
    }));
    const { error: saveError } = await supabase!.from("site_settings").upsert(rows, { onConflict: "key" });
    if (saveError) setError(saveError.message);
    else setNotice("Press email is saved.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Site Settings</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">Footer text, address, hours, and social links are edited on the Footer page.</p>
        </div>
        <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to="/">View page</Link>
      </div>
      <form className="mt-6 grid max-w-5xl gap-4 rounded-2xl border border-white/10 bg-[#141416] p-5 sm:grid-cols-2" onSubmit={(event) => void save(event)}>
        {settingFields.map((field) => (
          <label key={field.key} className={`block text-sm text-neutral-400 ${field.multiline ? "sm:col-span-2" : ""}`}>
            {field.label}
            {field.multiline ? (
              <textarea className="mt-2 min-h-24 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" value={values[field.key] ?? field.fallback} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
            ) : (
              <input className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" value={values[field.key] ?? field.fallback} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
            )}
          </label>
        ))}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {notice ? <p className="text-sm text-neutral-300">{notice}</p> : null}
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111111" }} type="submit">Save settings</button>
        </div>
      </form>
    </div>
  );
}

export function AdminApp() {
  const session = useAdminSession();

  if (!supabaseConfigured) return <Setup />;
  if (!session.ready) return <main className="grid min-h-screen place-items-center text-sm">Checking session…</main>;
  if (!session.userId) return <Login />;
  if (!session.isAdmin) {
    const host = supabaseProjectHost();
    const sql = [
      "grant select on table public.admin_profiles to authenticated;",
      "",
      "insert into public.admin_profiles (user_id, full_name, role)",
      `values ('${session.userId}', 'Gallery Owner', 'owner')`,
      "on conflict (user_id) do update set role = 'owner', full_name = excluded.full_name",
      "returning user_id, role;",
    ].join("\n");
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-sm text-white">
        <h1 className="text-2xl">This account is not an administrator.</h1>
        <p className="mt-3 leading-6 text-neutral-300">Signed in as {session.email}. Open the SQL editor for {host || "the Supabase project this site is using"}, run the statement below, and confirm the result shows this user id with role owner. Then reload this page.</p>
        {session.profileError ? <p className="mt-3 text-red-300">{session.profileError}</p> : null}
        <pre className="mt-5 overflow-x-auto rounded-xl border border-white/15 bg-black/40 p-4 text-[13px] leading-6 text-white">{sql}</pre>
      </main>
    );
  }

  return (
    <Shell email={session.email || ""} fullName={session.fullName} role={session.role}>
      <Routes>
        <Route index element={<Dashboard name={session.fullName || session.email?.split("@")[0] || "there"} />} />
        <Route path="home" element={<PageEditor page="home" title="Home Page" publicPath="/" sections={homeSections} />} />
        <Route path="about" element={<PageEditor page="about" title="About Page" publicPath="/about" sections={aboutSections} />} />
        <Route path="gallery" element={<PageEditor page="gallery" title="Gallery page" publicPath="/gallery" sections={gallerySections} />} />
        <Route path="artworks" element={<Artworks />} />
        <Route path="artworks/:id" element={<ArtworkEditor />} />
        <Route path="gallery/collections" element={<Collections />} />
        <Route path="artists/*" element={<ArtistsAdmin />} />
        <Route path="auctions/*" element={<AuctionsAdmin />} />
        <Route path="exhibitions/*" element={<ExhibitionsAdmin />} />
        <Route path="journal" element={<JournalAdmin />} />
        <Route path="inquiries" element={<ContactAdmin />} />
        <Route path="assistant" element={<AssistantAdmin />} />
        <Route path="footer" element={<FooterAdmin />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Shell>
  );
}
