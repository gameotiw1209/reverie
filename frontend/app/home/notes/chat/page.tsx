"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import {
  apiRequest,
  clearChatHistory,
  getChatHistory,
  sendChatMessage,
} from "@/lib/api";
import type { ChatMessage } from "@/lib/api";
import CloudSky from "@/src/components/notes/cloudBackground";
import NotesSidebar, {
  type Note,
  type NoteUser,
} from "@/src/components/notes/notesSidebar";
import ChatLanding from "@/src/components/chat/chatLanding";
import ChatConversation from "@/src/components/chat/chatConversation";

type UserResponse = { user: NoteUser };

export default function ChatPage() {
  const router = useRouter();

  const [user, setUser] = useState<NoteUser | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredNotes = notes.filter((note) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.text.toLowerCase().includes(query)
    );
  });

  const loadHistory = useCallback(async (noteId: string) => {
    setLoadingHistory(true);
    setError("");

    try {
      const result = await getChatHistory(noteId);
      setMessages(result.chat);
    } catch (err) {
      setMessages([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load conversation history.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const selectChatNote = useCallback(
    async (note: Note | null) => {
      setSelectedNote(note);
      setMessages([]);
      setError("");

      if (!note) {
        router.replace("/home/notes/chat");
        return;
      }

      router.replace(
        `/home/notes/chat?noteId=${encodeURIComponent(note.id)}`,
      );
      await loadHistory(note.id);
    },
    [loadHistory, router],
  );

  useEffect(() => {
    let cancelled = false;

    async function initialise() {
      try {
        setLoading(true);
        setError("");

        const [{ user }, fetchedNotes] = await Promise.all([
          apiRequest<UserResponse>("/auth/me"),
          apiRequest<Note[]>("/notes"),
        ]);

        if (cancelled) return;

        setUser(user);
        setNotes(fetchedNotes);

        const noteId = new URLSearchParams(
          window.location.search,
        ).get("noteId");

        if (noteId) {
          const note = fetchedNotes.find((item) => item.id === noteId);

          if (note) {
            setSelectedNote(note);
            setLoadingHistory(true);

            try {
              const result = await getChatHistory(note.id);
              if (!cancelled) setMessages(result.chat);
            } catch (err) {
              if (!cancelled) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Unable to load conversation history.",
                );
              }
            } finally {
              if (!cancelled) setLoadingHistory(false);
            }
          } else {
            router.replace("/home/notes/chat");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Chat page loading error:", err);
          router.replace("/");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialise();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    const audio = new Audio("/20180512.mp4");
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
    } catch {
      setError("Unable to play ambient audio.");
    }
  }, [soundEnabled]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!selectedNote || sending || !message.trim()) return;

      const noteId = selectedNote.id;
      const content = message.trim();
      const timestamp = new Date().toISOString();

      const optimisticMessage: ChatMessage = {
        id: `temp-${crypto.randomUUID()}`,
        noteId,
        userId: user?.id ?? "",
        role: "user",
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setMessages((current) => [...current, optimisticMessage]);
      setSending(true);
      setError("");

      try {
        await sendChatMessage(noteId, content);

        const result = await getChatHistory(noteId);

        if (selectedNote?.id === noteId) {
          setMessages(result.chat);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to send your message. Please try again.",
        );
      } finally {
        setSending(false);
      }
    },
    [selectedNote, sending, user],
  );

  const clearConversation = useCallback(async () => {
    if (!selectedNote || clearing) return;

    if (!window.confirm("Clear the conversation for this note?")) return;

    try {
      setClearing(true);
      setError("");

      await clearChatHistory(selectedNote.id);
      setMessages([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to clear conversation.",
      );
    } finally {
      setClearing(false);
    }
  }, [selectedNote, clearing]);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }, [router]);

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
    <main className="relative min-h-dvh w-full overflow-x-clip bg-sky-200 text-white">
      <div className="pointer-events-none fixed inset-0 z-0 select-none">
        <CloudSky />
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply" />
      </div>

      <NotesSidebar
        user={user}
        notes={filteredNotes}
        selectedId={selectedNote?.id ?? null}
        sidebarOpen={sidebarOpen}
        search={search}
        onSearchChange={setSearch}
        onToggle={() => setSidebarOpen((open) => !open)}
        onNewNote={() => router.push("/home/notes")}
        onSelectNote={(note) => void selectChatNote(note)}
        onDeleteNote={(note) => {
          void (async () => {
            if (!window.confirm(`Delete "${note.title || "Untitled note"}"?`)) {
              return;
            }

            try {
              await apiRequest(`/notes/${note.id}`, { method: "DELETE" });

              setNotes((current) =>
                current.filter((item) => item.id !== note.id),
              );

              if (selectedNote?.id === note.id) {
                setSelectedNote(null);
                setMessages([]);
                router.replace("/home/notes/chat");
              }
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Unable to delete note.",
              );
            }
          })();
        }}
        onLogout={() => void logout()}
        onAskAI={() => router.push("/home/notes/chat")}
      />

      <section
        className={`relative z-10 flex h-dvh min-h-0 flex-col overflow-hidden px-3 pb-3 pt-20 transition-[margin-left] duration-200 sm:px-6 sm:pt-6 ${
          sidebarOpen ? "md:ml-[320px]" : "md:ml-24"
        }`}
      >
        <div className="absolute right-4 top-4 z-20 sm:right-6">
          <button
            type="button"
            onClick={() => void toggleSound()}
            title={soundEnabled ? "Turn sound off" : "Turn sound on"}
            aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white shadow-lg backdrop-blur-xl transition hover:bg-black/45"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-auto mb-3 w-full max-w-3xl rounded-xl border border-rose-200/20 bg-rose-950/60 px-4 py-3 text-sm text-rose-100 backdrop-blur-xl"
          >
            {error}
          </div>
        )}

        {selectedNote && (messages.length > 0 || sending) ? (
          <ChatConversation
            notes={notes}
            selectedNote={selectedNote}
            messages={messages}
            sending={sending}
            loadingHistory={loadingHistory}
            clearing={clearing}
            onSelectNote={(note) => void selectChatNote(note)}
            onSend={sendMessage}
            onClear={() => void clearConversation()}
          />
        ) : selectedNote && loadingHistory ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center text-sm text-white/70">
            Loading your conversation...
          </div>
        ) : (
          <ChatLanding
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={(note) => void selectChatNote(note)}
            onSend={sendMessage}
            sending={sending}
            onPrompt={(prompt) => void sendMessage(prompt)}
          />
        )}
      </section>
    </main>
  );
}