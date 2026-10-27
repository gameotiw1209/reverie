
"use client";

import { useState } from "react";
import { User,House,Search,Plus,Sparkles,MoreHorizontal,Trash2,LogOut,PanelLeft,X,} from "lucide-react";

export type Note = {
  id: string;
  userID: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteUser = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  user: NoteUser;
  notes: Note[];
  selectedId: string | null;
  sidebarOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onToggle: () => void;
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  onLogout: () => void;
  onAskAI: () => void;
};

function formatNoteDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotesSidebar({
  user,
  notes,
  selectedId,
  sidebarOpen,
  search,
  onSearchChange,
  onToggle,
  onNewNote,
  onSelectNote,
  onDeleteNote,
  onLogout,
  onAskAI,
}: Props) {
  const [menuId, setMenuId] = useState<string | null>(null);

  const sortedNotes = [...notes].sort(
  (a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
);

  if (!sidebarOpen) {
    return (
      <div className="fixed left-5 top-5 z-40">
        <button
          onClick={onToggle}
          title="Open sidebar"
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-clear px-3 py-2.5 text-white shadow-xl backdrop-blur-xl transition hover:bg-clear/90 hover:text-amber-300"
        >
          <PanelLeft size={17} />
          {/* <span className="font-instrument text-lg italic">Reverie</span> */}
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" />
        </button>
      </div>
    );
  }

  return (
    <aside className="fixed inset-y-3 left-3 z-30 flex h-[calc(100dvh-1.5rem)] w-[290px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#15171C]/28 text-white/90 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="flex items-center gap-2 font-instrument text-2xl italic tracking-wide text-white">
            Reverie
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" />
          </span>

          <button
            onClick={onToggle}
            title="Collapse sidebar"
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <PanelLeft size={16} />
          </button>
        </div>

        <button
          onClick={onAskAI}
          className="group flex w-full items-center justify-between rounded-xl border border-amber-300/30 bg-white/5 px-3.5 py-2.5 text-white shadow-sm transition hover:bg-white/10"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-sm shadow-amber-400/40 transition group-hover:scale-105">
              <Sparkles size={13} />
            </span>
            <span className="text-sm font-medium tracking-tight text-amber-300">
              Ask Marx 
            </span>
          </span>
          {/* <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-wider text-amber-200/60">
            ⌘K
          </kbd> */}
        </button>

        <nav>
          <button
            onClick={onNewNote}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            <House size={16} className="text-white/50" />
            Home Sanctuary
          </button>
        </nav>

        <label className="relative block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-lg border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/35 focus:border-amber-300/60 focus:ring-1 focus:ring-amber-300/30"
          />
        </label>

        <div className="mt-1 flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-2.5 pb-2">
            <span className="text-[11px] font-semibold tracking-widest text-white/40 uppercase">
              Recent Notes
            </span>
            <button
              onClick={onNewNote}
              title="New note"
              className="rounded p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {sortedNotes.map((note) => (
              <div key={note.id} className="group relative">
                <button
                  onClick={() => onSelectNote(note)}
                  className={`flex w-full items-center justify-between rounded-xl border-l-2 px-3 py-2 text-left transition ${
                    selectedId === note.id
                      ? "border-amber-300 bg-white/[0.09] text-white shadow-sm"
                      : "border-transparent text-amber-100/70 hover:bg-white/5 hover:text-amber-100"
                  }`}
                >
                  <span className="flex min-w-0 flex-col pr-2">
                    <span className="truncate text-xs font-medium">
                      {note.title || "Untitled note"}
                    </span>
                    <span className="mt-1 text-[10px] text-white/35">
                      {formatNoteDate(note.updatedAt)}
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => setMenuId(menuId === note.id ? null : note.id)}
                  aria-label={`Actions for ${note.title || "note"}`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/40 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreHorizontal size={15} />
                </button>

                {menuId === note.id && (
                  <div className="absolute right-1 top-9 z-50 w-48 rounded-xl border border-white/15 bg-[#1A1D24] p-1.5 shadow-2xl">
                    <button
                      onClick={() => {
                        onDeleteNote(note);
                        setMenuId(null);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-rose-400 transition hover:bg-rose-500/15"
                    >
                      <Trash2 size={14} />
                      Delete Note
                    </button>
                  </div>
                )}
              </div>
            ))}

            {sortedNotes.length === 0 && (
              <p className="px-3 py-4 text-xs leading-6 text-white/40">
                Your pages will appear here. Start with a new note.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center justify-between gap-2 rounded-xl p-2 transition hover:bg-white/5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-500 text-slate-900 shadow-inner">
              <User className="h-4 w-4" />
              </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-white/90">
                {user.name}
              </span>
              <span className="truncate text-[10px] text-white/40">
                {user.email}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign out"
            className="rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-rose-400"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
