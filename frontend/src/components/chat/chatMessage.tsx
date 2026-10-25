"use client";

import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMessageType } from "@/lib/api";

type Props = {
  message: ChatMessageType;
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%] sm:px-5 ${
          isUser
            ? "rounded-br-md border border-amber-300/55 bg-amber-600/45 text-white"
            : "rounded-bl-md border border-white/10 bg-[#171B29]/45 text-white/90"
        }`}
      >
        {!isUser && (
          <p className="mb-1.5 font-instrument text-[15px] text-amber-300">
            Marx
          </p>
        )}

        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="markdown-content space-y-0.5 [&_*]:leading-6">
  <ReactMarkdown 
  components={{
  h1: ({ children }) => (
    <h1 className="mb-0.5 mt-1.5 text-xl font-semibold first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-0.5 mt-1.5 text-lg font-semibold first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-0.5 mt-1 text-base font-semibold first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-0 leading-6">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-0.5 list-disc space-y-0 pl-5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-0.5 list-decimal space-y-0 pl-5">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-0.5 leading-6 marker:text-white/60 [&>p]:my-0 [&>ul]:my-0.5 [&>ol]:my-0.5">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-0.5 border-l-2 border-amber-300/50 pl-3 text-white/70">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-amber-300 underline underline-offset-2 hover:text-amber-200"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => (
    <code
      className={`${className ?? ""} rounded bg-black/30 px-1 py-0.5 font-mono text-[13px] text-amber-100`}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-1 overflow-x-auto rounded-lg border border-white/10 bg-[#0D111B] p-3 text-xs leading-5">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-1 border-white/15" />,
}}
>{message.content}
</ReactMarkdown>
</div>
        )}

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