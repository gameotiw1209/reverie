
"use client";

import { Check, Share2, Volume2, VolumeX } from "lucide-react";

type Props = {
  dirty: boolean;
  saving: boolean;
  hasNote: boolean;
  soundEnabled: boolean;
  onSave: () => void;
  onToggleSound: () => void;
  onShare: () => void;
};

export default function NotesToolbar({
  dirty,
  saving,
  hasNote,
  soundEnabled,
  onSave,
  onToggleSound,
  onShare,
}: Props) {
  return (
    <header className="relative z-20 mb-4 flex w-full max-w-[740px] flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs text-white shadow-sm backdrop-blur-md">
        <span
          className={`h-2 w-2 rounded-full ${
            saving ? "animate-pulse bg-amber-300" : "bg-emerald-400"
          }`}
        />
        <span className="font-newsreader text-sm italic">Quiet headspace</span>
        <span className="text-white/40">•</span>
        <span className="text-white/80">
          {saving ? "Saving..." : dirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onShare}
          disabled={!hasNote}
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-black/35 disabled:opacity-40"
        >
          <Share2 size={14} className="text-white/80" />
          Share
        </button>

        <button
          onClick={onSave}
          disabled={saving || !dirty}
          className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-[#FFF5E1] px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_4px_14px_rgba(255,245,225,0.25)] transition hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={14} />
          {saving ? "Saving..." : "Save Note"}
        </button>

        <button
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
          title={soundEnabled ? "Mute ambient sound" : "Enable ambient sound"}
          className="flex items-center justify-center rounded-full border border-white/20 bg-black/30 p-2 text-white/90 shadow-sm backdrop-blur-md transition hover:bg-black/40"
        >
          {soundEnabled ? (
            <Volume2 size={16} className="text-amber-300" />
          ) : (
            <VolumeX size={16} className="text-white/70" />
          )}
        </button>
      </div>
    </header>
  );
}
