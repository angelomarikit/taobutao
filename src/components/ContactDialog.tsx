import { createContext, useContext, useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { submitInquiry } from "@/lib/content";

import { copyText } from "@/lib/content";

const ContactContext = createContext<(() => void) | null>(null);

export function useOpenContact() {
  const open = useContext(ContactContext);
  if (!open) throw new Error("Contact is unavailable");
  return open;
}

export function ContactProvider({ children, copy }: { children: ReactNode; copy?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  return (
    <ContactContext.Provider value={() => setOpen(true)}>
      {children}
      <ContactDialog open={open} copy={copy} onClose={() => setOpen(false)} />
    </ContactContext.Provider>
  );
}

function ContactDialog({ open, copy, onClose }: { open: boolean; copy?: Record<string, string>; onClose: () => void }) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();
    if (trimmedName.length < 1 || trimmedName.length > 160) {
      setState("error");
      setNotice("Enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState("error");
      setNotice("Enter a valid email address.");
      return;
    }
    if (trimmedPhone.length < 6 || trimmedPhone.length > 40) {
      setState("error");
      setNotice("Enter a phone number.");
      return;
    }
    if (trimmedMessage.length < 1) {
      setState("error");
      setNotice("Write a short message.");
      return;
    }
    setState("loading");
    const result = await submitInquiry({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      subject: "Contact",
      message: trimmedMessage,
      inquiryType: "general",
    });
    if (result.ok) {
      setState("success");
      setNotice("Your message has been sent.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      return;
    }
    setState("error");
    setNotice(result.message);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[20] flex items-center justify-center bg-black/75 px-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[560px] border border-white/20 bg-black p-10 text-white max-[390px]:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="b5">{copyText(copy, "contact.dialog.heading", "CONTACT")}</p>
            <h2 id={titleId} className="h4 mt-3">{copyText(copy, "contact.dialog", "Write to the gallery")}</h2>
          </div>
          <button className="border-0 bg-transparent p-0 text-[28px] leading-none text-white" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <Field label="Name" value={name} onChange={setName} autoComplete="name" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
          <label className="block">
            <span className="b6 text-white">Message</span>
            <textarea
              className="mt-2 h-28 w-full resize-none border-0 border-b border-[rgb(145,145,145)] bg-transparent px-0 py-2 text-[14px] text-white outline-none"
              required
              maxLength={4000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <button className="b5 border-0 bg-transparent p-0 text-white disabled:opacity-40" type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Sending" : "Send"}
          </button>
          {notice ? <p className={`b6 ${state === "error" ? "text-[rgb(255,180,180)]" : "text-white"}`}>{notice}</p> : null}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="b6 text-white">{label}</span>
      <input
        className="mt-2 h-10 w-full border-0 border-b border-[rgb(145,145,145)] bg-transparent px-0 text-[14px] text-white outline-none"
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
