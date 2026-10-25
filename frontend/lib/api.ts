const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("Backend URL is not configured.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your internet connection and try again.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.msg === "string"
        ? data.msg
        : typeof data?.message === "string"
          ? data.message
          : `Request failed (${response.status}). Please try again.`,
    );
  }

  return data as T;
}

export type ChatMessage = {
  id: string;
  noteId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatHistoryResponse = {
  chat: ChatMessage[];
};

export type ChatReplyResponse = {
  msg: string;
  reply: string;
};

export async function getChatHistory(noteId: string) {
  return apiRequest<ChatHistoryResponse>(
    `/notes/${encodeURIComponent(noteId)}/chat`,
  );
}

export async function sendChatMessage(noteId: string, message: string) {
  return apiRequest<ChatReplyResponse>(
    `/notes/${encodeURIComponent(noteId)}/chat`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );
}

export async function clearChatHistory(noteId: string) {
  return apiRequest<{ msg: string }>(
    `/notes/${encodeURIComponent(noteId)}/chat`,
    {
      method: "DELETE",
    },
  );
}