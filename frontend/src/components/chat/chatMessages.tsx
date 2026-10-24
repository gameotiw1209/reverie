"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/api";
import ChatMessage from "./chatMessage";

type Props = {
  messages: ChatMessageType[];
  sending: boolean;
};

export default function ChatMessages({ messages, sending }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className=" hide-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="mb-2 flex items-center justify-between text-[11px] text-white/45">
          <span>✦ &nbsp; Your conversation</span>
          {/* <span className="text-emerald-300/80">● Private to your account</span> */}
        </div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-white/10 bg-[#171B23]/45 px-5 py-3 text-sm text-white/60">
              Marx is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}