"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import CloudSky from "@/src/components/notes/cloudBackground";
import NotesSidebar, { type Note, type NoteUser } from "@/src/components/notes/notesSidebar";
import NotebookEditor from "@/src/components/notes/noteBookeditor";
import NotesToolbar from "@/src/components/notes/notesToolbar";
import NoteShareCard from "@/src/components/notes/noteShare";
import { shareNoteImage } from "@/lib/shareNote";
import { getSavedTheme, setSavedTheme } from "@/lib/theme";

type UserResponse = { user: NoteUser };

export default function NotesPage() {
  const router = useRouter();

  const [user, setUser] = useState<NoteUser | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const shareCardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

      setSelectedId(null);
      setTitle("");
      setText("");
      setDirty(false);
    } catch (err) {
      console.error("Notes page authentication/loading error:", err);
      setError(err instanceof Error ? err.message : "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDarkMode(getSavedTheme());
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const audio = new Audio("/20200229 2.mp4");
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (soundEnabled) {
      audio.pause();
      setSoundEnabled(false);
      return;
    }

    try {
      await audio.play();
      setSoundEnabled(true);
      setError("");
    } catch (err) {
      console.error("Ambient audio playback error:", err);
      setError("Unable to play ambient audio. Check public/20200229 2.mp4.");
      setSoundEnabled(false);
    }
  }, [soundEnabled]);

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

      setUser(null);
      setNotes([]);
      setSelectedId(null);
      setTitle("");
      setText("");
      setDirty(false);

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      setError(
        err instanceof Error
          ? `Unable to log out: ${err.message}`
          : "Unable to log out. Please try again.",
      );
    }
  }, [router]);

  const shareNote = useCallback(async () => {
    if (!selectedNote || !shareCardRef.current) return;

    try {
      await shareNoteImage({
        element: shareCardRef.current,
        title,
      });

      setError("");
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message || "Unable to share this note.");
      }
    }
  }, [selectedNote, title]);

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
          document
            .querySelector<HTMLInputElement>('input[placeholder="Search notes..."]')
            ?.focus();
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

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode((current) => {
      const newMode = !current;
      setSavedTheme(newMode);
      return newMode;
    });
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#15171C] text-white">
        <p className="font-newsreader text-2xl italic">
          Opening your sanctuary...
        </p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="relative min-h-dvh w-full overflow-x-clip bg-sky-200 text-slate-800">
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <CloudSky
          background={darkMode ? "#050A1A" : "#005BFF"}
          baseColor={darkMode ? "#1C2B4D" : "#B4D2F0"}
          accentColor={darkMode ? "#2E3850" : "#FFFFFF"}
          speed={87}
          clouds={{
            cirrus: 100,
            shadow: 70,
            softness: 200,
          }}
          sun={{
            x: 100,
            y: 100,
            glow: "#FFFFFF",
          }}
          pointer={{
            wind: 300,
            damping: 50,
            parallax: 300,
          }}
        />

        <div
          className={
            darkMode
              ? "absolute inset-0 bg-black/10"
              : "absolute inset-0 bg-blue-900/5 mix-blend-multiply"
          }
        />
      </div>

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
        onAskAI={() => {
          if (selectedId) {
            router.push(
              `/home/notes/chat?noteId=${encodeURIComponent(selectedId)}`,
            );
          } else {
            router.push("/home/notes/chat");
          }
        }}
      />

      <section
        className={`relative z-10 flex min-h-dvh flex-col items-center px-3 py-6 transition-[margin-left] duration-200 sm:px-6 sm:py-8 ${
          sidebarOpen ? "md:ml-[320px]" : "md:ml-24"
        }`}
      >
        <NotesToolbar
          dirty={dirty}
          saving={saving}
          hasNote={Boolean(selectedNote)}
          soundEnabled={soundEnabled}
          darkMode={darkMode}
          onSave={() => void saveNote()}
          onToggleSound={() => void toggleSound()}
          onToggleDarkMode={handleToggleDarkMode}
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

        {selectedNote && (
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              left: "-15000px",
              top: 0,
              width: 1200,
              pointerEvents: "none",
            }}
          >
            <NoteShareCard
              ref={shareCardRef}
              note={selectedNote}
              title={title}
              text={text}
            />
          </div>
        )}

        <footer className="mt-4 w-full shrink-0 pb-4 text-center text-xs text-white/80 drop-shadow">
          Press{" "}
          <kbd className="rounded border border-white/20 bg-black/30 px-1.5 py-0.5 text-[10px]">
            Esc
          </kbd>{" "}
          to collapse the sidebar · Reverie is your quiet space
        </footer>
      </section>
    </main>
  );
}