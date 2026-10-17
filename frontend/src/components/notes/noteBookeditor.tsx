
"use client";

import { useEffect, useRef } from "react";
import type { Note } from "./notesSidebar";

type Props = {
  note: Note | null;
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
  error: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotebookEditor({
  note,
  title,
  text,
  onTitleChange,
  onTextChange,
  error,
}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note) titleRef.current?.focus();
  }, [note?.id]);

  return (
    <article className="paper-texture ruled-paper relative flex min-h-[920px] w-full max-w-[730px] flex-row overflow-hidden rounded-l-md rounded-r-2xl border border-[#e4d7be]">
      <div className="spiral-spine-shadow relative flex w-10 shrink-0 flex-col items-center justify-start py-8 select-none sm:w-14">
        <div className="absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-slate-300/60" />

        <div className="flex w-full flex-col items-center gap-5">
          {Array.from({ length: 28 }, (_, index) => (
            <div
              key={index}
              className="relative flex h-4 w-8 items-center justify-between"
            >
              <div className="hole-punch h-2.5 w-2.5 rounded-full bg-slate-400" />
              <div className="absolute right-0 left-1.5 h-2 -rotate-6 transform rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col px-4 pt-7 pb-12 sm:px-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-newsreader text-xs tracking-wide text-slate-400 italic">
            {note ? "A page from your journal" : "A new beginning"}
          </span>

          <div className="flex items-center gap-2 font-instrument text-slate-600">
            <span className="text-sm text-stone-600">
              {formatDate(note?.createdAt ?? new Date().toISOString())}
            </span>
            <span className="text-base font-light text-stone-400 select-none">
              /&nbsp;&nbsp;/
            </span>
          </div>
        </div>

        <input
          ref={titleRef}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="A title for this moment..."
          aria-label="Note title"
          className="mb-2 w-full border-0 bg-transparent font-instrument text-3xl leading-[45px] tracking-tight text-[#1E1C18] outline-none placeholder:text-stone-400 sm:text-4xl"
        />

        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Let your thoughts find their way onto the page..."
          aria-label="Note content"
          spellCheck
          className="min-h-[650px] w-full flex-1 resize-y border-0 bg-transparent font-newsreader text-[18px] leading-[36px] tracking-normal text-[#282521] outline-none placeholder:text-stone-400 sm:text-[19px]"
        />

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-300/50 pt-3 text-[11px] text-stone-500">
          <span>{text.length} characters</span>
          <span>
            {note
              ? `Updated ${formatDate(note.updatedAt)}`
              : "This page hasn't been saved yet"}
          </span>
        </div>
      </div>

      <div className="w-2 shrink-0 border-l border-stone-300/80 bg-gradient-to-r from-stone-300 to-stone-400" />
    </article>
  );
}
