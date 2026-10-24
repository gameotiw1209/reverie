"use client";

import { ArrowUp, ChevronDown, FileText, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Note } from "@/src/components/notes/notesSidebar";

type Props = {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note | null) => void;
  initialMessage?: string;
  onSend: (message: string) => Promise<void>;
  sending: boolean;
  placeholder?: string;
};

export default function ChatComposer({
  notes,
  selectedNote,
  onSelectNote,
  onSend,
  sending,
  initialMessage,
  placeholder = "Ask Reverie anything about your note...",
}: Props) {
  const [message, setMessage] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const submit = async () => {
    const value = message.trim();

    if (!selectedNote || !value || sending) return;

    setMessage("");
    await onSend(value);
  };

  return (
    // <div className="shrink-0 border-t border-white/10 bg-clear p-3 sm:p-5">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-white/10 bg-[#171B23]/95 shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition focus-within:border-amber-200/30">
          <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit();
            }
         }}
         placeholder={placeholder}
         rows={1}
         maxLength={2000}
         disabled={!selectedNote || sending}
         className="min-h-[44px] max-h-32 w-full resize-none overflow-y-auto bg-transparent px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
         />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-3 py-3 sm:px-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectorOpen((open) => !open)}
                className="flex max-w-[220px] items-center gap-2 rounded-full border border-amber-300/15 bg-amber-300/[0.08] px-3 py-2 text-xs text-amber-100 transition hover:bg-amber-300/[0.14]"
              >
                <FileText size={13} className="shrink-0 text-amber-300" />

                <span className="truncate">
                  {selectedNote?.title || "Select a note"}
                </span>

                <ChevronDown size={13} className="shrink-0" />
              </button>

              {selectorOpen && (
                <div className="absolute bottom-full left-0 z-50 mb-2 max-h-64 w-[min(280px,calc(100vw-48px))] overflow-y-auto rounded-xl border border-white/10 bg-[#191D26] p-1.5 shadow-2xl">
                  {notes.length === 0 ? (
                    <p className="px-3 py-4 text-xs text-white/50">
                      Create a note before starting a conversation.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => {
                          onSelectNote(note);
                          setSelectorOpen(false);
                        }}
                        className={`block w-full rounded-lg px-3 py-2.5 text-left text-xs transition ${
                          selectedNote?.id === note.id
                            ? "bg-amber-300/10 text-amber-200"
                            : "text-white/75 hover:bg-white/5"
                        }`}
                      >
                        <span className="block truncate font-medium">
                          {note.title || "Untitled note"}
                        </span>
                        <span className="mt-1 block truncate text-[10px] text-white/40">
                          {note.text.slice(0, 70)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => void submit()}
              disabled={!selectedNote || !message.trim() || sending}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-400 text-slate-950 shadow-md shadow-orange-400/20 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] leading-5 text-#191D26">
          AI can make mistakes · Your conversations are private to your account
        </p>
      </div>
    // </div>
  );
}