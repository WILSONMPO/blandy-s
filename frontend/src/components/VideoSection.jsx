import React, { useRef, useState } from "react";
import { Play, Pause, VolumeX, Volume2, Youtube, ArrowUpRight } from "lucide-react";
import { VIDEOS, AUTHOR } from "../mock";

const VideoCard = ({ video, index }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    if (!ref.current) return;
    if (ref.current.paused) {
      ref.current.play();
      setPlaying(true);
    } else {
      ref.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setMuted(ref.current.muted);
  };

  return (
    <div className="group relative zoom-wrap aspect-[9/16] bg-[var(--ink)] cursor-pointer" onClick={toggle}>
      <video
        ref={ref}
        src={video.src}
        muted={muted}
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-transparent to-transparent ${playing ? "opacity-100" : "opacity-100"}`} />

      {/* Number */}
      <div className="absolute top-5 left-5 text-[var(--paper)] text-xs tracking-[0.3em] font-mono">
        FIELD NOTE · 0{index + 1}
      </div>

      {/* Mute */}
      <button
        onClick={toggleMute}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[var(--paper)]/15 backdrop-blur flex items-center justify-center text-[var(--paper)] hover:bg-[var(--paper)]/25 transition-colors"
        aria-label="Toggle mute"
      >
        {muted ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
      </button>

      {/* Play button */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--paper)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play size={22} strokeWidth={1.5} className="text-[var(--ink)] ml-1" fill="currentColor" />
          </div>
        </div>
      )}
      {playing && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-[var(--paper)]/80 backdrop-blur flex items-center justify-center">
            <Pause size={18} strokeWidth={1.5} className="text-[var(--ink)]" />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-[var(--paper)]">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[var(--paper)]/70 mb-2">
          <span>Video Essay</span>
          <span className="w-4 h-px bg-[var(--paper)]/40" />
          <span>{video.duration}</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl leading-tight">{video.title}</h3>
        <p className="font-serif text-sm text-[var(--paper)]/80 mt-2 max-w-xs">{video.description}</p>
      </div>
    </div>
  );
};

const VideoSection = () => {
  return (
    <section className="bg-[var(--paper-2)] py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-12 md:mb-16 items-end">
          <div className="md:col-span-7">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[var(--accent)] mb-4">Watch & Listen</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-none tracking-[-0.02em]">
              Field notes, <em className="italic">on camera</em>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-serif text-lg text-[var(--ink-2)] leading-relaxed">
              A companion to the written journal — short, unrehearsed reflections filmed between essays. New notes every Sunday.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {VIDEOS.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </div>

        {/* Watch on YouTube CTA */}
        <a
          href={AUTHOR.youtube}
          target="_blank"
          rel="noreferrer"
          className="group mt-12 md:mt-16 relative overflow-hidden block border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        >
          <div className="grid md:grid-cols-12 gap-6 items-center px-6 md:px-10 py-8 md:py-10">
            <div className="md:col-span-1 flex items-center justify-start md:justify-center">
              <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Youtube size={22} strokeWidth={1.75} className="text-[var(--paper)]" />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--accent)] mb-2">The Full Archive</p>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.01em]">
                Watch full episodes on <em className="italic">YouTube</em>.
              </h3>
              <p className="font-serif text-base md:text-lg mt-2 opacity-80">
                Every conversation, interview and long-form episode of Mind Over Matter — subscribe for weekly uploads.
              </p>
            </div>
            <div className="md:col-span-3 flex md:justify-end">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase border-b border-current pb-0.5">
                Visit channel
                <ArrowUpRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default VideoSection;
