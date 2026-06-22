import type {
  GeminiChatRequest,
  GeminiChatResponse,
  ReleaseStatus,
} from "./types";

/** Node / test environments. Web passes `import.meta.env.VITE_API_BASE_URL` at call site. */
export function getApiBaseUrl(
  viteEnvBaseUrl?: string,
): string {
  if (viteEnvBaseUrl !== undefined) {
    return viteEnvBaseUrl;
  }
  return process.env.VITE_API_BASE_URL ?? process.env.API_BASE_URL ?? "";
}

export const API_ROUTES = {
  geminiChat: "/api/gemini/chat",
  releaseStatus: "/api/app/release-status",
} as const;

export async function fetchReleaseStatus(
  baseUrl: string,
): Promise<ReleaseStatus> {
  const response = await fetch(`${baseUrl}${API_ROUTES.releaseStatus}`);

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<ReleaseStatus>;
}

export async function postGeminiChat(
  baseUrl: string,
  body: GeminiChatRequest,
): Promise<GeminiChatResponse> {
  const response = await fetch(`${baseUrl}${API_ROUTES.geminiChat}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<GeminiChatResponse>;
}
