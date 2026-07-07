import React from "react";
import { POSTS } from "../mock";
import { ArrowUpRight } from "lucide-react";

const LatestPosts = () => {
  const [hero, ...rest] = POSTS;
  return (
    <section id="latest" className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-4">The Journal</p>
          <h2 className="font-serif text-5xl md:text-7xl tracking-[-0.02em] leading-none">
            Latest <em className="italic">essays</em>
          </h2>
        </div>
        <a href="#" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase link-underline">
          View archive <ArrowUpRight size={14} strokeWidth={1.5} />
        </a>
      </div>

      {/* Featured big card */}
      <a href="#" className="grid md:grid-cols-12 gap-8 md:gap-12 group">
        <div className="md:col-span-7 zoom-wrap aspect-[16/10] bg-[var(--paper-2)]">
          <img src={hero.cover} alt={hero.title} className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-[var(--muted)] mb-5">
            <span className="text-[var(--accent)]">{hero.category}</span>
            <span className="w-6 h-px bg-[var(--line)]" />
            <span>{hero.date}</span>
          </div>
          <h3 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.01em] group-hover:italic group-hover:text-[var(--accent)] transition-all">
            {hero.title}
          </h3>
          <p className="font-serif text-lg text-[var(--ink-2)] leading-relaxed mt-5 max-w-lg">
            {hero.excerpt}
          </p>
          <div className="mt-8 flex items-center gap-4 text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
            <span>{hero.readTime}</span>
            <span className="w-8 h-px bg-[var(--line)]" />
            <span className="link-underline text-[var(--ink)]">Read essay</span>
          </div>
        </div>
      </a>

      <div className="rule my-16" />

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-10 md:gap-12">
        {rest.map((post, i) => (
          <a href="#" key={post.id} className="group flex flex-col">
            <div className="zoom-wrap aspect-[4/5] bg-[var(--paper-2)] mb-6">
              <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
              <span className="text-[var(--accent)]">{post.category}</span>
              <span className="w-4 h-px bg-[var(--line)]" />
              <span>{post.date}</span>
            </div>
            <h3 className="font-serif text-2xl md:text-[28px] leading-tight tracking-[-0.01em] group-hover:italic group-hover:text-[var(--accent)] transition-all">
              {post.title}
            </h3>
            <p className="font-serif text-base text-[var(--ink-2)] leading-relaxed mt-3">
              {post.excerpt}
            </p>
            <span className="mt-5 text-[11px] tracking-[0.25em] uppercase text-[var(--muted)]">
              {post.readTime}
            </span>
            <span className="mt-1 text-[11px] tracking-[0.25em] uppercase link-underline w-fit">Read</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default LatestPosts;
