import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeEmail } from "../api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ state: "loading", message: "" });
    try {
      const res = await subscribeEmail(email);
      if (res?.status === "already_subscribed") {
        setStatus({
          state: "success",
          message: "You’re already on the list — thank you.",
        });
      } else {
        setStatus({
          state: "success",
          message: "Welcome. The next letter arrives Sunday.",
        });
      }
      try {
        const list = JSON.parse(localStorage.getItem("mom_subs") || "[]");
        list.push({ email, at: new Date().toISOString() });
        localStorage.setItem("mom_subs", JSON.stringify(list));
      } catch (_) {}
      setTimeout(() => {
        setEmail("");
        setStatus({ state: "idle", message: "" });
      }, 4500);
    } catch (err) {
      const detail =
        err?.response?.data?.detail?.toString?.() ||
        "Something went wrong. Please try again.";
      setStatus({ state: "error", message: detail });
      setTimeout(() => setStatus({ state: "idle", message: "" }), 4500);
    }
  };

  return (
    <section id="newsletter" className="bg-[var(--ink)] text-[var(--paper)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--accent)] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--gold)] blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-6">The Sunday Letter</p>
            <h2 className="font-serif text-5xl md:text-8xl leading-[0.95] tracking-[-0.02em]">
              A quiet letter,
              <br />
              every <em className="italic">Sunday</em>.
            </h2>
            <p className="font-serif text-lg md:text-xl leading-relaxed text-[var(--paper)]/75 mt-8 max-w-xl">
              One essay. One question. One piece of art. Delivered gently to your inbox. No noise, no upsell — just a moment to think.
            </p>
          </div>

          <div className="md:col-span-5">
            <form onSubmit={submit} className="relative">
              <label className="text-[11px] tracking-[0.3em] uppercase text-[var(--paper)]/60 block mb-4">
                Subscribe — it’s free
              </label>
              <div className="flex items-end gap-4 border-b border-[var(--paper)]/30 focus-within:border-[var(--accent)] transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent py-3 outline-none text-lg font-serif placeholder:text-[var(--paper)]/30 text-[var(--paper)]"
                  disabled={status.state === "loading"}
                />
                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="flex items-center gap-2 pb-3 text-xs tracking-[0.3em] uppercase text-[var(--paper)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
                >
                  <span>{status.state === "loading" ? "Sending…" : "Subscribe"}</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              </div>
              {status.state === "success" && (
                <div className="absolute -bottom-10 left-0 flex items-center gap-2 text-[var(--accent)] text-sm font-serif italic rise">
                  <CheckCircle2 size={16} strokeWidth={1.5} />
                  <span>{status.message}</span>
                </div>
              )}
              {status.state === "error" && (
                <div className="absolute -bottom-10 left-0 flex items-center gap-2 text-red-300 text-sm font-serif italic rise">
                  <AlertCircle size={16} strokeWidth={1.5} />
                  <span>{status.message}</span>
                </div>
              )}
              <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--paper)]/40 mt-6">
                Read by 12,400 quietly ambitious people.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
