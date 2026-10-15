const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("Backend URL is not configured.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.msg === "string"
        ? data.msg
        : typeof data?.message === "string"
          ? data.message
          : "Unable to sign in. Please try again.",
    );
  }

  return data as T;
}