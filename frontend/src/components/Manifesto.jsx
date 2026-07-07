import React from "react";
import { Newspaper, PenLine, Headphones, Feather } from "lucide-react";

const ITEMS = [
  {
    n: "01",
    icon: PenLine,
    label: "Long-form Essays",
    text: "Slow-reading pieces on psychology, self and the interior life.",
  },
  {
    n: "02",
    icon: Feather,
    label: "Sunday Letters",
    text: "A short, personal note every week. Just one small thought worth carrying.",
  },
  {
    n: "03",
    icon: Headphones,
    label: "The Podcast",
    text: "Conversations with therapists, artists and quietly interesting people.",
  },
  {
    n: "04",
    icon: Newspaper,
    label: "Field Notes",
    text: "Short video reflections filmed between essays. Unrehearsed, on purpose.",
  },
];

const Manifesto = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
      <div className="grid md:grid-cols-12 gap-10 items-end mb-14">
        <div className="md:col-span-7">
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-6">The Masthead</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em]">
            Four ways in.
            <br />
            <em className="italic">One quiet room.</em>
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className="font-serif text-lg text-[var(--ink-2)] leading-relaxed">
            Mind Over Matter is a small, deliberate publication. No trending takes, no algorithmic urgency — just four rooms to think in, updated slowly and with care.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-0 border-t border-[var(--line)]">
        {ITEMS.map(({ n, icon: Icon, label, text }, i) => (
          <div
            key={n}
            className={`p-8 md:p-10 group hover:bg-[var(--paper-2)] transition-colors ${
              i !== 0 ? "md:border-l border-[var(--line)]" : ""
            } ${i !== ITEMS.length - 1 ? "border-b md:border-b-0 border-[var(--line)]" : ""}`}
          >
            <div className="flex items-start justify-between mb-8">
              <span className="font-mono text-xs text-[var(--muted)]">{n}</span>
              <Icon
                size={22}
                strokeWidth={1.25}
                className="text-[var(--ink)] group-hover:text-[var(--accent)] group-hover:rotate-6 transition-all"
              />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl leading-tight tracking-[-0.01em] group-hover:italic transition-all">
              {label}
            </h3>
            <p className="font-serif text-base text-[var(--ink-2)] leading-relaxed mt-4">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Manifesto;
