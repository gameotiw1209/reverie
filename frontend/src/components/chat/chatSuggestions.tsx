"use client";

import {
  BookOpen,
  CalendarDays,
  MessageCircleHeart,
  Smile,
} from "lucide-react";

const suggestions = [
  {
    title: "What is this note about?",
    description: "Help me understand the main ideas in my note.",
    icon: BookOpen,
    prompt:
      "Explain what this note is about, summarize its main ideas, and highlight what seems most important.",
  },
  {
    title: "Help me plan things out",
    description: "Turn my thoughts into a simple, practical plan.",
    icon: CalendarDays,
    prompt:
      "Based on this note, help me create a realistic and practical plan. Break it into small steps I can follow.",
  },
  {
    title: "What do you think about my thoughts?",
    description: "Get a fresh perspective on what you wrote.",
    icon: MessageCircleHeart,
    prompt:
      "What do you think about the thoughts and ideas I've expressed in this note? Give me an honest, thoughtful perspective without judging me.",
  },
  {
    title: "I'm feeling happy today",
    description: "Explore what's making today feel special.",
    icon: Smile,
    prompt:
      "Based on this note, help me reflect on what might be making me feel happy today and how I can appreciate or carry this feeling forward.",
  },
];

type Props = {
  onChoose: (prompt: string) => void;
  disabled: boolean;
};

export default function ChatSuggestions({ onChoose, disabled }: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
      {suggestions.map(({ title, description, icon: Icon, prompt }) => (
        <button
          key={title}
          type="button"
          disabled={disabled}
          onClick={() => onChoose(prompt)}
          className="group flex min-h-[88px] items-start gap-3 rounded-xl border border-white/10 bg-[#19212D]/85 p-3.5 text-left shadow-lg backdrop-blur-xl transition hover:border-amber-200/30 hover:bg-[#202B3B]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:p-4"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-black/25 text-amber-300">
            <Icon size={17} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold leading-5 text-white/90">
              {title}
            </span>
            <span className="mt-1 block text-[11px] leading-4 text-white/50">
              {description}
            </span>
          </span>

          <span className="pt-1 text-white/30 transition group-hover:text-amber-200">
            ↗
          </span>
        </button>
      ))}
    </div>
  );
}