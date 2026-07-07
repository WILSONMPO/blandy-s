import React, { useEffect, useState } from "react";
import { EDITORS_PICKS as FALLBACK, AUTHOR } from "../mock";
import { ArrowRight, Quote } from "lucide-react";
import { fetchEditorsPicks } from "../api";

const AuthorAndPicks = () => {
  const [picks, setPicks] = useState(FALLBACK);

  useEffect(() => {
    let mounted = true;
    fetchEditorsPicks()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length) setPicks(data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="about" className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
      <div className="grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7">
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-6">The Writer</p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
            <div className="sm:col-span-2">
              <div className="zoom-wrap aspect-[4/5] bg-[var(--paper-2)]">
                <img
                  src={AUTHOR.photo}
                  alt={AUTHOR.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = AUTHOR.photoFallback)}
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
                Meet <em className="italic text-[var(--accent)]">Blandina</em>.
              </h2>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] mt-4">
                {AUTHOR.role}
              </p>
              <p className="font-serif text-lg text-[var(--ink-2)] leading-relaxed mt-6">
                {AUTHOR.bio}
              </p>
              <p className="font-serif text-base text-[var(--ink-2)]/90 leading-relaxed mt-4">
                {AUTHOR.longBio}
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="text-[10px] tracking-[0.3em] uppercase border border-[var(--line)] px-3 py-2 text-[var(--ink-2)]">
                  Mental Health
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase border border-[var(--line)] px-3 py-2 text-[var(--ink-2)]">
                  Mindset Coaching
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase border border-[var(--line)] px-3 py-2 text-[var(--ink-2)]">
                  Podcast Host
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative pl-10 md:pl-16">
            <Quote size={40} strokeWidth={1} className="absolute -left-1 top-0 text-[var(--accent)]" />
            <p className="font-serif italic text-2xl md:text-4xl leading-[1.2] text-[var(--ink)] max-w-2xl">
              “The mind is not a battlefield to conquer, but a garden to tend. You will not out-hustle it. You can only listen better.”
            </p>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] mt-6">
              — From the essay, <span className="italic">On Softness as Strategy</span>
            </p>
          </div>
        </div>

        <aside className="md:col-span-5">
          <div className="sticky top-32 border-l border-[var(--line)] pl-8">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-6">Editor’s Picks</p>
            <h3 className="font-serif text-3xl md:text-4xl leading-[1.05] tracking-[-0.01em] mb-10">
              Essays we keep returning to.
            </h3>
            <ol className="space-y-8">
              {picks.slice(0, 6).map((p, i) => (
                <li key={p.id || p.slug}>
                  <a href="#" className="group flex items-start gap-6">
                    <span className="font-mono text-xs text-[var(--muted)] mt-2">0{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-2">
                        <span className="text-[var(--accent)]">{p.category}</span>
                        <span className="w-4 h-px bg-[var(--line)]" />
                        <span>{p.date}</span>
                      </div>
                      <h4 className="font-serif text-xl md:text-2xl leading-tight group-hover:italic group-hover:text-[var(--accent)] transition-all">
                        {p.title}
                      </h4>
                    </div>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="mt-3 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AuthorAndPicks;
