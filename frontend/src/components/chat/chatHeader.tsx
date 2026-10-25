"use client";

import { ChevronDown, Trash2,NotebookText } from "lucide-react";
import type { Note } from "@/src/components/notes/notesSidebar";

type Props = {
  note: Note;
  onClear: () => void;
  clearing: boolean;
};

export default function ChatHeader({ note, onClear, clearing }: Props) {
  return (
    <header className="flex min-w-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
          <NotebookText className="text-sm text-amber-300"></NotebookText>
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {note.title || "Untitled note"}
          </p>
          <p className="text-[11px] text-white/45">
            Chatting about this note
          </p>
        </div>

        {/* <ChevronDown size={15} className="shrink-0 text-white/40" /> */}
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={clearing}
        className="flex shrink-0 items-center gap-2 rounded-lg border border-rose-300/15 px-2.5 py-2 text-xs text-red-300/90 transition hover:bg-red-400/15 disabled:opacity-50 sm:px-3"
      >
        <Trash2 size={14} />
        <span className="hidden sm:inline">
          {clearing ? "Clearing..." : "Clear conversation"}
        </span>
      </button>
    </header>
  );
}