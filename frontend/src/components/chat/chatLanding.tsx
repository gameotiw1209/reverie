"use client";

import ChatSuggestions from "./chatSuggestions";
import ChatComposer from "./chatComposer";
import type { Note } from "@/src/components/notes/notesSidebar";

type Props = {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note | null) => void;
  onSend: (message: string) => Promise<void>;
  sending: boolean;
  onPrompt: (prompt: string) => void;
};

export default function ChatLanding({
  notes,
  selectedNote,
  onSelectNote,
  onSend,
  sending,
  onPrompt,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-1 py-8 sm:px-4 sm:py-10">
      <div className="mb-7 text-center sm:mb-9">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-orange-200/60 bg-orange-400/20 text-orange-300 shadow-[0_0_30px_rgba(251,146,60,0.18)]">
          <span className="text-2xl">✿</span>
        </div>

        <h1 className="font-newsreader text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          Where would you like your
          <br className="hidden sm:block" />{" "}
          <span className="italic text-orange-300">thoughts</span> to wander
          today?
        </h1>

        <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-white/75 sm:text-sm">
          Ask freely about your journal entries, or link a specific note to
          explore deeper in this quiet sanctuary.
        </p>
      </div>

      <ChatSuggestions
        disabled={!selectedNote || sending}
        onChoose={(value) => {
          onPrompt(value);
        }}
      />

      {!selectedNote && (
        <p className="mt-3 text-center text-xs text-white/65">
          Select a note in the prompt bar to start your conversation.
        </p>
      )}

      <div className="mt-5">
        <ChatComposer
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={onSelectNote}
          onSend={onSend}
          sending={sending}
          placeholder={
            selectedNote
              ? "Ask Reverie anything about your note..."
              : "Select a note to begin..."
          }
          initialMessage=""
        />
      </div>
    </div>
  );
}