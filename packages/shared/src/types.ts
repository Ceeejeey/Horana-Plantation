export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface GeminiChatRequest {
  messages?: ChatMessage[];
  prompt?: string;
  sessionId?: string;
}

export interface GeminiChatResponse {
  text: string;
  sessionId?: string;
}

export interface ApiErrorResponse {
  error: string;
}

/** Firestore: appConfig/release */
export interface ReleaseStatus {
  released: boolean;
  updatedAt?: string;
}
