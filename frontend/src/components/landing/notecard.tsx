
"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, Edit3 } from "lucide-react";

const prompts = [
  "Write what's on your mind…",
  "What's been on your mind today?",
  "What are you avoiding thinking about?",
  "What felt quietly significant this week?",
];

const reflections = [
  "It sounds like today carried quiet tension. What part of that feels easiest to release tonight?",
  "That thought holds subtle clarity. If you stayed with this feeling for five minutes, what would it ask of you?",
  "There is quiet grace in noticing this. What do you need most right now: rest, expression, or stillness?",
  "A meaningful reflection. What would shift if you allowed this thought to simply exist without resolving it right away?",
];

export default function JournalCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflection, setReflection] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!inputRef.current?.value.trim()) {
        setPromptIndex((current) => (current + 1) % prompts.length);
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  function beginReflection() {
    const thought = value.trim();

    setReflection(
      thought
        ? `I hear that: “${thought}.” Let's explore what lies beneath that gentle awareness.`
        : reflections[Math.floor(Math.random() * reflections.length)],
    );

    setShowReflection(true);
    inputRef.current?.focus();
  }

  return (
    <div id="get-started" className="mt-1 w-full max-w-[360px]">
      <div
        onClick={() => inputRef.current?.focus()}
        className="group relative w-full cursor-text text-left"
      >
        <div className="absolute -left-2.5 -top-2.5 h-[280px] w-full rounded-2xl bg-[#91ACCC]/80 transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />

        <div className="relative z-10 flex h-[280px] w-full -rotate-1 flex-col justify-between rounded-2xl bg-[#FFF5E1] p-5 text-[#1E1B18] shadow-2xl transition-transform duration-300 group-hover:rotate-0">
          <div>
            <div
              className="flex items-center justify-between gap-2 border-b border-[#AEC9EB]/60 pb-2 text-[10px] font-bold tracking-[0.12em] text-[#2E4965]"
              style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FD8C20]" />
                <span>SUBJECT:</span>
                <span className="truncate font-normal tracking-normal opacity-80">
                  Evening Musings
                </span>
              </span>

              <span className="shrink-0 opacity-75">
                DATE: <span className="font-normal">Oct 24</span>
              </span>
            </div>

            <div
              className="relative mt-2 text-lg leading-8 text-[#2B2724]"
              style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            >
              <div className="ruled-line flex items-center overflow-hidden">
                <span className="mr-2 inline-block h-5 w-[2px] shrink-0 animate-pulse rounded-full bg-[#FD8C20]" />

                <div className="relative flex w-full items-center">
                  {!value && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center truncate text-sm italic text-stone-500/80">
                      {prompts[promptIndex]}
                    </span>
                  )}

                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setValue(nextValue);

                      if (showReflection && nextValue.trim()) {
                        setReflection(
                          `Noticing: “${nextValue.trim()}” — take a deep breath. What does this bring to the surface?`,
                        );
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        beginReflection();
                      }
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Write a journal thought"
                    className="relative z-10 h-full w-full border-0 bg-transparent p-0 text-base leading-8 text-[#2B2724] outline-none ring-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="ruled-line" />
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-between pt-1 text-[11px] text-[#2E4965]/60"
            style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            <span className="flex items-center gap-1">
              <Edit3 size={13} />
              AI Sanctuary
            </span>

            <span className="text-[10px] uppercase tracking-wider opacity-50">
              Page 01
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={beginReflection}
        className="mt-3 flex items-center gap-2 pl-1 text-xs tracking-wide text-[#DDC1AF]/90 transition-colors hover:text-[#FFB781]"
        style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
      >
        <CornerDownLeft size={15} className="text-[#FFB781]" />
        Press Enter or click to begin reflection
      </button>

      {showReflection && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#131313]/80 p-4 backdrop-blur-md">
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#FFB781]"
            style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            A moment to reflect
          </p>

          <p
            className="text-lg italic leading-relaxed text-[#FFF6E8]"
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
          >
            “{reflection}”
          </p>

          <p
            className="mt-3 text-[10px] text-[#DDC1AF]/70"
            style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            Sample reflection · Connect your AI backend to generate personalised responses.
          </p>
        </div>
      )}
    </div>
  );
}
