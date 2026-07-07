import React from "react";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";
import { AUTHOR, CATEGORIES } from "../mock";

const Footer = () => {
  return (
    <footer className="bg-[var(--paper)] border-t border-[var(--line)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <h3 className="font-serif text-4xl md:text-5xl leading-[1] tracking-[-0.01em]">
              Mind <em className="italic text-[var(--accent)]">Over</em> Matter
            </h3>
            <p className="font-serif text-base text-[var(--ink-2)] leading-relaxed mt-4 max-w-md">
              A slow-reading journal on the psychology of everyday life. Written and edited by Blandina Mashala.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] mb-5">Read</p>
            <ul className="space-y-3 font-serif">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <a href={`#${c.slug}`} className="link-underline">{c.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] mb-5">Reach the desk</p>
            <ul className="space-y-4 font-serif">
              <li>
                <a href={`mailto:${AUTHOR.email}`} className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Mail size={16} strokeWidth={1.5} />
                  {AUTHOR.email}
                </a>
              </li>
              <li>
                <a href={`tel:${AUTHOR.phone}`} className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Phone size={16} strokeWidth={1.5} />
                  {AUTHOR.phone}
                </a>
              </li>
              <li>
                <a href={AUTHOR.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Instagram size={16} strokeWidth={1.5} />
                  @_blandina.jpg
                </a>
              </li>
              <li>
                <a href={AUTHOR.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <Youtube size={16} strokeWidth={1.5} />
                  YouTube · Mind Over Matter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule mt-16" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
          <p>© {new Date().getFullYear()} Mind Over Matter · All rights reserved</p>
          <div className="flex items-center gap-6">
            <a href="#" className="link-underline">Colophon</a>
            <a href="#" className="link-underline">Privacy</a>
            <a href="#" className="link-underline">Masthead</a>
          </div>
          <p className="font-serif italic normal-case tracking-normal text-[13px] text-[var(--ink-2)]">
            Set in Fraunces & Inter. Printed in pixels.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
