import React from "react";
import { ArrowRight } from "lucide-react";
import { FEATURED } from "../mock";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-16 md:pb-24">
        {/* Issue meta */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-[var(--muted)]">
            <span>Issue No. 07</span>
            <span className="w-8 h-px bg-[var(--line)]" />
            <span>Summer ’25</span>
          </div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] hidden md:block">
            The Mindset Edition
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          {/* Left: type */}
          <div className="md:col-span-6 rise">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-6">
              {FEATURED.category} · Featured Essay
            </p>
            <h1 className="font-serif text-[54px] leading-[0.98] md:text-[104px] md:leading-[0.95] tracking-[-0.02em] text-[var(--ink)]">
              The Quiet
              <br />
              <em className="italic text-[var(--accent)] font-normal">Revolution</em>
              <br />
              of Choosing
              <br />
              Yourself.
            </h1>
            <p className="font-serif text-lg md:text-xl leading-relaxed text-[var(--ink-2)] max-w-xl mt-8">
              {FEATURED.dek}
            </p>
            <div className="flex items-center gap-6 mt-10">
              <a
                href="#featured"
                className="group inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[var(--ink)]"
              >
                <span className="link-underline">Read the essay</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
              <div className="text-[11px] tracking-[0.25em] uppercase text-[var(--muted)] flex items-center gap-2">
                <span>{FEATURED.readTime}</span>
                <span className="w-4 h-px bg-[var(--line)]" />
                <span>{FEATURED.date}</span>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="md:col-span-6 rise" style={{ animationDelay: "120ms" }}>
            <div className="relative zoom-wrap aspect-[4/5] bg-[var(--paper-2)]">
              <img
                src={FEATURED.cover}
                alt="Featured essay cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[var(--paper)] px-3 py-1.5 text-[10px] tracking-[0.3em] uppercase">
                Cover Story
              </div>
              <div className="absolute bottom-4 right-4 font-serif italic text-sm text-[var(--paper)] bg-[var(--ink)]/70 backdrop-blur px-3 py-1.5">
                photography · studio archive
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rule" />
    </section>
  );
};

export default Hero;
