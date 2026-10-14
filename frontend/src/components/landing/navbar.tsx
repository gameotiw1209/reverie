
"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);

  useEffect(() => {
    return () => {
      playingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (contextRef.current) void contextRef.current.close();
    };
  }, []);

  function playChime() {
    const context = contextRef.current;
    const masterGain = gainRef.current;

    if (!playingRef.current || !context || !masterGain) return;

    const notes = [216, 288, 324, 432, 540, 648];
    const frequency = notes[Math.floor(Math.random() * notes.length)];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 6);

    timerRef.current = setTimeout(
      playChime,
      3500 + Math.random() * 3000,
    );
  }

  async function toggleSoundscape() {
    let context = contextRef.current;

    if (!context) {
      context = new AudioContext();
      const gain = context.createGain();
      gain.gain.value = 0.08;
      gain.connect(context.destination);

      contextRef.current = context;
      gainRef.current = gain;
    }

    if (context.state === "suspended") await context.resume();

    if (playingRef.current) {
      playingRef.current = false;
      setIsPlaying(false);

      if (timerRef.current) clearTimeout(timerRef.current);
      gainRef.current?.gain.setTargetAtTime(0, context.currentTime, 0.4);
    } else {
      playingRef.current = true;
      setIsPlaying(true);
      gainRef.current?.gain.setValueAtTime(0.08, context.currentTime);
      playChime();
    }
  }

  return (
    <header className="relative z-20 flex w-full items-center justify-between gap-3 px-5 py-4 md:px-12">
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
        <button
          type="button"
          onClick={toggleSoundscape}
          aria-pressed={isPlaying}
          title="Toggle meadow soundscape"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs text-[#FFF6E8] backdrop-blur-md transition hover:bg-white/[0.12] active:scale-95"
        >
          {isPlaying ? (
            <Volume2 size={15} className="text-[#FFB781]" />
          ) : (
            <VolumeX size={15} className="text-[#FFB781]" />
          )}
          <span className="hidden sm:inline">
            {isPlaying ? "Meadow Wind · 432Hz" : "Soundscape · Paused"}
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
    </header>
  );
}
