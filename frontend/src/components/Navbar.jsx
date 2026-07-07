import React, { useEffect, useState } from "react";
import { Menu, Search, X, Youtube } from "lucide-react";
import { CATEGORIES, AUTHOR } from "../mock";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--paper)]/90 backdrop-blur-md border-b border-[var(--line)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
            aria-label="Menu"
          >
            <Menu size={18} strokeWidth={1.5} />
            <span className="text-xs tracking-[0.2em] uppercase hidden md:inline">Menu</span>
          </button>

          <a href="#" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="font-serif text-2xl md:text-[28px] leading-none tracking-tight">
              Mind <em className="italic text-[var(--accent)]">Over</em> Matter
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[var(--muted)] mt-1">
              An Editorial by Blandina Mashala
            </span>
          </a>

          <div className="flex items-center gap-4">
            <a
              href={AUTHOR.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube channel"
              className="group flex items-center gap-2 text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
            >
              <Youtube size={18} strokeWidth={1.5} />
              <span className="hidden md:inline text-[10px] tracking-[0.25em] uppercase">YouTube</span>
            </a>
            <button className="text-[var(--ink)] hover:text-[var(--accent)] transition-colors" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <a
              href="#newsletter"
              className="hidden md:inline-block text-xs tracking-[0.2em] uppercase border-b border-[var(--ink)] pb-0.5 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="hidden md:block border-t border-[var(--line)]/60">
        <div className="max-w-[1400px] mx-auto px-10">
          <nav className="flex items-center justify-center gap-10 h-11">
            {CATEGORIES.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="text-[11px] tracking-[0.25em] uppercase text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
              >
                {c.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Full screen menu */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-[var(--paper)] rise">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
            <span className="font-serif text-xl">Mind <em className="text-[var(--accent)]">Over</em> Matter</span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 mt-16 grid md:grid-cols-2 gap-16">
            <nav className="flex flex-col gap-6">
              {CATEGORIES.map((c, i) => (
                <a
                  key={c.slug}
                  href={`#${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-6"
                >
                  <span className="text-xs text-[var(--muted)] font-mono">0{i + 1}</span>
                  <span className="font-serif text-4xl md:text-6xl leading-none group-hover:italic group-hover:text-[var(--accent)] transition-all">
                    {c.name}
                  </span>
                </a>
              ))}
            </nav>
            <div className="flex flex-col justify-end">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-4">Elsewhere</p>
              <div className="flex flex-col gap-2 text-lg">
                <a href="#" className="link-underline w-fit">Instagram</a>
                <a href="#" className="link-underline w-fit">YouTube</a>
                <a href="#" className="link-underline w-fit">Podcast</a>
                <a href="mailto:blandinawmashala@gmail.com" className="link-underline w-fit">Email</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
