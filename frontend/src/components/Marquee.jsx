import React from "react";
import { Star } from "lucide-react";

const PHRASES = [
  "Essays on the architecture of the mind",
  "Slow reading. Deliberate living.",
  "A field guide to being a person",
  "Notes from the interior",
  "For the quietly ambitious",
];

const Marquee = () => {
  const doubled = [...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <section className="bg-[var(--ink)] text-[var(--paper)] overflow-hidden py-5">
      <div className="flex marquee-track whitespace-nowrap gap-14">
        {doubled.map((p, i) => (
          <div key={i} className="flex items-center gap-14 shrink-0">
            <span className="font-serif italic text-2xl md:text-3xl">{p}</span>
            <Star size={16} strokeWidth={1.25} className="text-[var(--accent)]" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
