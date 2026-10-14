"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = 0.5;

    return () => {
      audio?.pause();
    };
  }, []);

  async function toggleSoundscape() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.5;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Unable to play audio:", error);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <header className="relative z-20 flex w-full items-center justify-between gap-3 px-5 py-4 md:px-12">
      <audio
        ref={audioRef}
        src="/20180512.mp4"
        loop
        preload="none"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <div className="flex min-w-0 items-center gap-4">
        <a
          href="#home"
          className="shrink-0 text-3xl italic tracking-wide text-[#FFF6E8] transition-opacity hover:opacity-90"
          style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
        >
          Reverie
        </a>

        <div
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-[#FFF6E8]/80 backdrop-blur-md sm:inline-flex"
          style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFB781] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FFB781]" />
          </span>
          Twilight Sanctuary · Golden Hour
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div
          className="flex h-9 items-center justify-center gap-[3px] rounded-full px-2"
          role="img"
          aria-label={isPlaying ? "Music playing" : "Music paused"}
        >
          {isPlaying ? (
            Array.from({ length: 13 }, (_, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full bg-[#FFB781]"
                style={{
                  height: `${5 + ((i * 7 + 3) % 13)}px`,
                  animation: `music-wave ${0.45 + (i % 5) * 0.13}s ease-in-out ${i * 0.045}s infinite alternate`,
                  transformOrigin: "center",
                }}
              />
            ))
          ) : (
            <span className="text-sm tracking-[3px] text-[#FFB781]/80">
              ...
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleSoundscape}
          aria-label={isPlaying ? "Turn sound off" : "Turn sound on"}
          aria-pressed={isPlaying}
          title={isPlaying ? "Turn sound off" : "Turn sound on"}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs text-[#FFF6E8] backdrop-blur-md transition hover:bg-white/[0.12] active:scale-95"
        >
          {isPlaying ? (
            <Volume2 size={15} className="text-[#FFB781]" />
          ) : (
            <VolumeX size={15} className="text-[#FFB781]" />
          )}
          <span className="hidden sm:inline">
            Sound {isPlaying ? "On" : "Off"}
          </span>
        </button>

        <a
          href="#get-started"
          className="glow-sunset inline-flex items-center gap-2 rounded-full bg-[#FFDCC4] px-4 py-2.5 text-sm font-semibold text-[#2F1400] transition hover:scale-[1.03] active:scale-95 sm:px-6"
        >
          Get Started
          <ArrowRight size={17} />
        </a>
      </div>

      <style jsx>{`
        @keyframes music-wave {
          from {
            transform: scaleY(0.25);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </header>
  );
}