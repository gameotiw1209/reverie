"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/api";

type Props = {
  message: ChatMessageType;
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <article
        className={`max-w-[92%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[80%] sm:px-5 ${
          isUser
            ? "rounded-br-md border border-amber-200/15 bg-amber-100/15 text-white"
            : "rounded-bl-md border border-white/10 bg-[#171B23]/45 text-white/90"
        }`}
      >
        {!isUser && (
          <p className="mb-1.5 text-[15px] font-instrument  text-amber-300">
            Reverie
          </p>
        )}

        <p>{message.content}</p>

        <time className="mt-2 block text-right text-[10px] text-white/35">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </time>
      </article>
    </div>
  );
}