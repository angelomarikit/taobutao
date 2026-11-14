import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Application = {
  user_id: string;
  full_name: string | null;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export function AccountsAdmin() {
  const [rows, setRows] = useState<Application[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  async function load() {
    const { data, error: loadError } = await supabase!
      .from("admin_applications")
      .select("user_id, full_name, email, status, created_at")
      .order("created_at", { ascending: false });
    if (loadError) {
      setError(loadError.message.includes("admin_applications")
        ? "Run supabase/migrations/005_admin_applications.sql in the Supabase SQL editor, then reload this page."
        : loadError.message);
      return;
    }
    setError("");
    setRows((data ?? []) as Application[]);
  }

  useEffect(() => {
    void load();
  }, []);

  async function review(row: Application, status: "approved" | "rejected") {
    setBusy(row.user_id);
    setNotice("");
    setError("");
    if (status === "approved") {
      const { error: profileError } = await supabase!.from("admin_profiles").insert({
        user_id: row.user_id,
        full_name: row.full_name,
        role: "editor",
      });
      if (profileError && profileError.code !== "23505") {
        setError(profileError.message);
        setBusy("");
        return;
      }
    }
    const { error: reviewError } = await supabase!
      .from("admin_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("user_id", row.user_id);
    setBusy("");
    if (reviewError) {
      setError(reviewError.message);
      return;
    }
    setNotice(status === "approved" ? `${row.email} can now sign in.` : `${row.email} was declined.`);
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Accounts</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">New registrations stay off until an administrator approves them.</p>
        </div>
        <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to="/admin">Back</Link>
      </div>
      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {notice ? <p className="mt-4 text-sm text-neutral-300">{notice}</p> : null}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        {rows.length ? rows.map((row) => (
          <div key={row.user_id} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-b-0">
            <div>
              <p className="text-sm text-white">{row.full_name || row.email}</p>
              <p className="mt-1 text-xs text-neutral-400">{row.email}</p>
              <p className="mt-1 text-xs capitalize text-neutral-500">{row.status} · {new Date(row.created_at).toLocaleString()}</p>
            </div>
            {row.status === "pending" ? (
              <div className="flex gap-2">
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111" }} type="button" disabled={busy === row.user_id} onClick={() => void review(row, "approved")}>Approve</button>
                <button className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white" type="button" disabled={busy === row.user_id} onClick={() => void review(row, "rejected")}>Decline</button>
              </div>
            ) : null}
          </div>
        )) : <p className="px-5 py-8 text-sm text-neutral-400">No registration requests.</p>}
      </div>
    </div>
  );
}
