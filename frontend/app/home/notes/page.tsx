
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import CloudSky from "@/src/components/notes/cloudBackground";
import NotesSidebar, {type Note,type NoteUser,} from "@/src/components/notes/notesSidebar";
import NotebookEditor from "@/src/components/notes/noteBookeditor";
import NotesToolbar from "@/src/components/notes/notesToolbar";

type UserResponse = { user: NoteUser };

export default function NotesPage() {
  const router = useRouter();

  const [user, setUser] = useState<NoteUser | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);

  const selectedNote = notes.find((note) => note.id === selectedId) ?? null;

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.text.toLowerCase().includes(query),
    );
  }, [notes, search]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { user } = await apiRequest<UserResponse>("/auth/me");
      setUser(user);

      const data = await apiRequest<Note[]>("/notes");
      setNotes(data);

      if (data.length > 0) {
        setSelectedId(data[0].id);
        setTitle(data[0].title);
        setText(data[0].text);
      } else {
        setSelectedId(null);
        setTitle("");
        setText("");
      }

      setDirty(false);
    } catch (error) {
  console.error("Notes page authentication/loading error:", error);
  setError(
    error instanceof Error ? error.message : "Failed to load notes."
  );
}finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectNote = useCallback((note: Note) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setText(note.text);
    setDirty(false);
    setError("");
  }, []);

  const newNote = useCallback(() => {
    setSelectedId(null);
    setTitle("");
    setText("");
    setDirty(false);
    setError("");
  }, []);

  const saveNote = useCallback(async () => {
    if (!title.trim() || !text.trim()) {
      setError("Add a title and some text before saving.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (selectedId) {
        const updated = await apiRequest<Note>(`/notes/${selectedId}`, {
          method: "PATCH",
          body: JSON.stringify({ title, text }),
        });

        setNotes((current) =>
          current.map((note) => (note.id === updated.id ? updated : note)),
        );
        setSelectedId(updated.id);
        setTitle(updated.title);
        setText(updated.text);
      } else {
        const created = await apiRequest<Note>("/notes", {
          method: "POST",
          body: JSON.stringify({ title, text }),
        });

        setNotes((current) => [created, ...current]);
        setSelectedId(created.id);
        setTitle(created.title);
        setText(created.text);
      }

      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save note.");
    } finally {
      setSaving(false);
    }
  }, [selectedId, title, text]);

  const deleteNote = useCallback(
    async (note: Note) => {
      if (!window.confirm(`Delete "${note.title || "Untitled note"}"?`)) {
        return;
      }

      try {
        setError("");

        await apiRequest<{ msg: string }>(`/notes/${note.id}`, {
          method: "DELETE",
        });

        const remaining = notes.filter((item) => item.id !== note.id);
        setNotes(remaining);

        if (selectedId === note.id) {
          if (remaining.length > 0) {
            selectNote(remaining[0]);
          } else {
            newNote();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete note.");
      }
    },
    [notes, selectedId, selectNote, newNote],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest<{ msg: string }>("/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }, [router]);

  const shareNote = useCallback(async () => {
    if (!selectedNote) return;

    const content = `${title}\n\n${text}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "Reverie note",
          text: content,
        });
      } else {
        await navigator.clipboard.writeText(content);
        setError("Note copied to clipboard.");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Unable to share this note.");
      }
    }
  }, [selectedNote, title, text]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        setSidebarOpen(false);
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isTyping) {
          setSearch("");
        } else {
          document.querySelector<HTMLInputElement>(
            'input[placeholder="Search notes..."]',
          )?.focus();
        }
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveNote();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveNote]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#15171C] text-white">
        <p className="font-newsreader text-2xl italic">
          Opening your sanctuary...
        </p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="relative h-dvh min-h-[600px] overflow-hidden bg-sky-200 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <CloudSky />
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        <NotesSidebar
          user={user}
          notes={filteredNotes}
          selectedId={selectedId}
          sidebarOpen={sidebarOpen}
          search={search}
          onSearchChange={setSearch}
          onToggle={() => setSidebarOpen((open) => !open)}
          onNewNote={newNote}
          onSelectNote={selectNote}
          onDeleteNote={(note) => void deleteNote(note)}
          onLogout={() => void logout()}
          onAskAI={() => setError("AI chat will be connected in a later step.")}
        />

        <section className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto px-3 py-6 sm:px-6 sm:py-8">
          <NotesToolbar
            dirty={dirty}
            saving={saving}
            hasNote={Boolean(selectedNote)}
            soundEnabled={soundEnabled}
            onSave={() => void saveNote()}
            onToggleSound={() => setSoundEnabled((enabled) => !enabled)}
            onShare={() => void shareNote()}
          />

          <NotebookEditor
            note={selectedNote}
            title={title}
            text={text}
            onTitleChange={(value) => {
              setTitle(value);
              setDirty(true);
            }}
            onTextChange={(value) => {
              setText(value);
              setDirty(true);
            }}
            error={error}
          />

          <footer className="mt-4 pb-4 text-center text-xs text-white/80 drop-shadow">
            Press <kbd className="rounded border border-white/20 bg-black/30 px-1.5 py-0.5 text-[10px]">Esc</kbd>{" "}
            to collapse the sidebar · Reverie is your quiet space
          </footer>
        </section>
      </div>
    </main>
  );
}
