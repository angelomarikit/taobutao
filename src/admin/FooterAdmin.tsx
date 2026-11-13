import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { footerFields } from "@/data/footer";
import { supabase } from "@/lib/supabase";

const fieldClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none";

export function FooterAdmin() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const keys = footerFields.map((field) => field.key);
    void supabase!.from("site_settings").select("key,value").in("key", keys).then(({ data, error: loadError }) => {
      if (loadError) {
        setError(loadError.message);
        return;
      }
      const next: Record<string, string> = {};
      for (const row of data ?? []) next[row.key] = row.value;
      setValues(next);
    });
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    const rows = footerFields.map((field) => ({
      key: field.key,
      value: values[field.key] ?? field.fallback,
      updated_at: new Date().toISOString(),
    }));
    const { error: saveError } = await supabase!.from("site_settings").upsert(rows, { onConflict: "key" });
    if (saveError) setError(saveError.message);
    else setNotice("The footer is saved. Reload the public site to see it.");
  }

  const groups = [...new Set(footerFields.map((field) => field.group))];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Footer</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            These lines are stored in Supabase and shown in the public footer. Explore and Services keep their current pages. How to buy, How to sell, Request an estimate, and Contact us open the contact window.
          </p>
        </div>
        <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" to="/">View page</Link>
      </div>
      <form className="mt-6 max-w-5xl space-y-6" onSubmit={(event) => void save(event)}>
        {groups.map((group) => (
          <fieldset key={group} className="rounded-2xl border border-white/10 bg-[#141416] p-5">
            <legend className="px-1 text-sm text-neutral-300">{group}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {footerFields.filter((field) => field.group === group).map((field) => (
                <label key={field.key} className={`block text-sm text-neutral-400 ${field.multiline ? "sm:col-span-2" : ""}`}>
                  {field.label}
                  {field.multiline ? (
                    <textarea className={`${fieldClass} min-h-24`} value={values[field.key] ?? field.fallback} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
                  ) : (
                    <input className={fieldClass} value={values[field.key] ?? field.fallback} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })} />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-4">
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {notice ? <p className="text-sm text-neutral-300">{notice}</p> : null}
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium" style={{ color: "#111111" }} type="submit">Save footer</button>
        </div>
      </form>
    </div>
  );
}
