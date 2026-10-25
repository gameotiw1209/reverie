"use client";

import { Lightbulb, TreePalm , Rocket, Sparkles } from "lucide-react";

const suggestions = [
  {
    title: "Reflect on recurring themes across my notes",
    description: "Look for patterns in the note you selected.",
    icon: TreePalm,
    prompt: "What recurring themes or patterns do you notice in this note?",
  },
  {
    title: "Help me unpack an unsettled emotion",
    description: "Explore what you might be feeling.",
    icon: Lightbulb,
    prompt: "Help me unpack the emotions expressed in this note.",
  },
  {
    title: "Draft a gentle evening reflection",
    description: "Reflect on the day with gratitude.",
    icon: Rocket,
    prompt: "Help me write a gentle reflection based on this note.",
  },
  {
    title: "Find connections in my thoughts",
    description: "Explore the ideas behind your writing.",
    icon: Sparkles,
    prompt: "What connections or insights can you find in this note?",
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