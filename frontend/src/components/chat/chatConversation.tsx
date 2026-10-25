"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/api";
import type { Note } from "@/src/components/notes/notesSidebar";
import ChatHeader from "./chatHeader";
import ChatMessages from "./chatMessages";
import ChatComposer from "./chatComposer";

type Props = {
  notes: Note[];
  selectedNote: Note;
  messages: ChatMessageType[];
  sending: boolean;
  loadingHistory: boolean;
  clearing: boolean;
  onSelectNote: (note: Note | null) => void;
  onSend: (message: string) => Promise<void>;
  onClear: () => void;
};

export default function ChatConversation({
  notes,
  selectedNote,
  messages,
  sending,
  loadingHistory,
  clearing,
  onSelectNote,
  onSend,
  onClear,
}: Props) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden">
      <ChatHeader
        note={selectedNote}
        onClear={onClear}
        clearing={clearing}
      />

      {loadingHistory ? (
        <div className="flex flex-1 items-center justify-center text-sm text-white/60">
          Why Reverie ?...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div>
            <div className="text-3xl text-amber-300">✦</div>
            <p className="mt-3 font-newsreader text-2xl italic text-white">
              A quiet space to reflect
            </p>
            <p className="mt-2 text-xs leading-5 text-white/55">
              Ask a question about your selected note to begin.
            </p>
          </div>
        </div>
      ) : (
        <ChatMessages messages={messages} sending={sending} />
      )}

      <ChatComposer
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={onSelectNote}
        onSend={onSend}
        sending={sending || loadingHistory}
      />
    </section>
  );
}