"use client";

import { forwardRef } from "react";
import type { Note } from "./notesSidebar";

type Props = {
  note: Note;
  title: string;
  text: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const NoteShareCard = forwardRef<HTMLDivElement, Props>(
  function NoteShareCard({ note, title, text }, ref) {
    return (
      <div
        ref={ref}
        className="relative flex flex-col items-center justify-center gap-8 overflow-hidden px-20 py-20"
        style={{
          width: 1200,
          minHeight: 800,
          backgroundColor: "#005BFF",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <article
          className="paper-texture ruled-paper relative flex w-full flex-row overflow-hidden rounded-l-md rounded-r-2xl border border-[#e4d7be]"
          style={{ maxWidth: 900 }}
        >
          <div
            className="spiral-spine-shadow relative w-16 shrink-0 select-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 12px, #94a3b8 0 5px, transparent 6px), radial-gradient(circle at 50% 20px, #f8fafc 0 2px, transparent 3px)",
              backgroundSize: "100% 34px, 100% 34px",
              backgroundRepeat: "repeat-y, repeat-y",
            }}
          >
            <div className="absolute inset-y-0 right-0 w-px border-r border-dashed border-slate-300/60" />
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col px-10 pt-10 pb-8">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-newsreader text-xl tracking-wide text-slate-400 italic">
                A page from your journal
              </span>

              <span className="text-base text-stone-600">
                {formatDate(note.createdAt)}
              </span>
            </div>

            <h1
              className="mb-4 whitespace-pre-wrap break-words text-[#1E1C18]"
              style={{
                fontFamily: "var(--font-instrument-serif), serif",
                fontSize: 54,
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
              }}
            >
              {title || "A moment in time"}
            </h1>

            <div
              className="whitespace-pre-wrap break-words text-[#282521]"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: 25,
                lineHeight: 1.8,
                overflowWrap: "anywhere",
              }}
            >
              {text || " " }
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-stone-300/50 pt-4 text-sm text-stone-500">
              <span>{text.length} characters</span>
              <span>Reverie journal</span>
            </div>
          </div>

          <div className="w-3 shrink-0 border-l border-stone-300/80 bg-gradient-to-r from-stone-300 to-stone-400" />
        </article>

        <div
          className="font-instrument text-3xl text-[#102A56] opacity-80"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
        >
          Reverie
        </div>
        <div className="absolute bottom-5 right-6 z-10 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm text-white/90 shadow-lg backdrop-blur-md">
        built with ❤️ aum
        </div>
      </div>
    );
  },
);

export default NoteShareCard;