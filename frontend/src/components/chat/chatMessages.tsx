"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/api";
import ChatMessage from "./chatMessage";

type Props = {
  messages: ChatMessageType[];
  sending: boolean;
};
export default function ChatMessages({ messages, sending }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    wasAtBottomRef.current = distanceFromBottom < 100;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !wasAtBottomRef.current) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-5 sm:px-6 sm:py-7"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="mb-2 flex items-center justify-between text-[11px] text-white/45">
          <span>✦ &nbsp; Your conversation</span>
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
      </div>
    </div>
  );
}