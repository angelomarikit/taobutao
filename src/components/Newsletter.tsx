import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { submitInquiry } from "@/lib/content";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setState("loading");
    const result = await submitInquiry({
      name: "Newsletter",
      email,
      message: "Quarterly correspondence request.",
      inquiryType: "newsletter",
    });
    if (result.ok) {
      setState("success");
      setMessage("You are on the list.");
      setEmail("");
      return;
    }
    setState("error");
    setMessage(result.message);
  }

  return (
    <section className="bg-black px-10 py-[120px] max-[810px]:px-5 max-[810px]:py-[100px]">
      <Reveal y={20} duration={0.8} ease="cubic-bezier(0.16, 1, 0.3, 1)" threshold={0.25} className="mx-auto w-full max-w-[670px]">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="b5 text-white">THE CORRESPONDENCE</p>
          <h2 className="h3 text-white">stay connected</h2>
          <p className="b2 text-white">Receive updates on exhibitions, events, and new acquisitions.</p>
        </div>
        <form className="mt-16 max-[810px]:mt-10" onSubmit={onSubmit}>
          <div className="flex items-center gap-5 max-[810px]:flex-col max-[810px]:items-stretch">
            <input
              className="h-10 w-full border-0 bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-[rgb(153,153,153)] focus:border focus:border-[rgb(0,153,255)]"
              type="email"
              name="Email"
              required
              placeholder="jane@framer.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="Email"
            />
            <button
              className="b5 shrink-0 text-left text-white disabled:opacity-40 max-[810px]:self-start"
              type="submit"
              disabled={state === "loading"}
            >
              {state === "loading" ? "Sending" : state === "success" ? "Sent" : "Submit"}
            </button>
          </div>
          <div className="mt-5 h-px bg-[rgb(145,145,145)]" />
          <p className="b5 mt-5 text-center text-white">Quarterly · No more than four letters a year</p>
          {message ? (
            <p className={`b6 mt-4 text-center ${state === "error" ? "text-[rgb(255,180,180)]" : "text-white"}`}>{message}</p>
          ) : null}
        </form>
      </Reveal>
    </section>
  );
}
