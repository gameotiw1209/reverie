"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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

function useAutosize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
) {
  const mirrorRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    if (!mirrorRef.current) {
      const mirror = document.createElement("textarea");
      mirror.setAttribute("tabindex", "-1");
      mirror.setAttribute("aria-hidden", "true");
      mirror.style.position = "absolute";
      mirror.style.top = "0";
      mirror.style.left = "-9999px";
      mirror.style.visibility = "hidden";
      mirror.style.pointerEvents = "none";
      mirror.style.height = "0";
      document.body.appendChild(mirror);
      mirrorRef.current = mirror;
    }

    const mirror = mirrorRef.current;
    const computed = window.getComputedStyle(textarea);

    mirror.style.width = `${textarea.clientWidth}px`;
    mirror.style.font = computed.font;
    mirror.style.letterSpacing = computed.letterSpacing;
    mirror.style.lineHeight = computed.lineHeight;
    mirror.style.padding = computed.padding;
    mirror.style.border = computed.border;
    mirror.style.boxSizing = computed.boxSizing;
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordBreak = "break-word";
    mirror.value = value || " ";

    const nextHeight = mirror.scrollHeight;

    if (textarea.style.height !== `${nextHeight}px`) {
      textarea.style.height = `${nextHeight}px`;
    }
  }, [value, ref]);

  useEffect(() => {
    return () => {
      mirrorRef.current?.remove();
      mirrorRef.current = null;
    };
  }, []);
}

export default function NotebookEditor({
  note,
  title,
  text,
  onTitleChange,
  onTextChange,
  error,
}: Props) {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!note) titleRef.current?.focus();
  }, [note?.id]);

  useAutosize(titleRef, title);
  useAutosize(textRef, text);

  return (
    <article className="paper-texture ruled-paper relative flex w-full max-w-[730px] flex-1 flex-row overflow-hidden rounded-l-md rounded-r-2xl border border-[#e4d7be]">
      <div
        className="spiral-spine-shadow relative w-10 shrink-0 select-none sm:w-14"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 12px, #94a3b8 0 5px, transparent 6px), radial-gradient(circle at 50% 20px, #f8fafc 0 2px, transparent 3px)",
          backgroundSize: "100% 34px, 100% 34px",
          backgroundRepeat: "repeat-y, repeat-y",
        }}
      >
        <div className="absolute inset-y-0 right-0 w-px border-r border-dashed border-slate-300/60" />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col px-0 pt-7 pb-12">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-newsreader text-sm tracking-wide text-slate-400 italic">
            {note ? "A page from your journal" : "A new beginning"}
          </span>

          <div className="flex items-center gap-2 font-instrument text-slate-300">
            <span className="text-sm text-stone-600">
              {formatDate(note?.createdAt ?? new Date().toISOString())}
            </span>
            <span className="text-base font-light text-stone-400 select-none">
              /&nbsp;&nbsp;/
            </span>
          </div>
        </div>

        <textarea
          ref={titleRef}
          rows={1}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="A title for this moment..."
          aria-label="Note title"
          className="mb-1 w-full resize-none overflow-hidden border-0 bg-transparent !font-instrument !text-[24px] !font-normal !leading-[1.15] tracking-tight text-[#1E1C18] outline-none placeholder:text-stone-400 sm:!text-[62px] sm:!leading-[1.1]"
        />

        <textarea
          ref={textRef}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Let your thoughts find their way onto the page..."
          aria-label="Note content"
          spellCheck
          className="mt-3  w-full resize-none overflow-hidden border-0 bg-transparent !font-newsreader !text-[17px] !leading-[1.8] tracking-normal text-[#282521] outline-none placeholder:text-stone-400 sm:!text-[20px] sm:!leading-[1.8]"
        />

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-300/50 pt-3 text-[11px] text-stone-500">
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