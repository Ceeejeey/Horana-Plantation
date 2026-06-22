import * as admin from "firebase-admin";
import type { ChatMessage } from "@horana/shared";

export interface ChatSessionRecord {
  sessionId: string;
  messageCount: number;
  lastPromptPreview: string;
  updatedAt: admin.firestore.FieldValue;
  createdAt: admin.firestore.FieldValue;
}

let db: admin.firestore.Firestore | null = null;

export function getFirestore(): admin.firestore.Firestore {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    db = admin.firestore();
  }
  return db;
}

export async function persistChatSession(
  sessionId: string,
  messages: ChatMessage[] | undefined,
  prompt: string | undefined,
): Promise<void> {
  const firestore = getFirestore();
  const ref = firestore.collection("chatSessions").doc(sessionId);
  const lastUserContent =
    prompt ??
    [...(messages ?? [])].reverse().find((m) => m.role === "user")?.content ??
    "";

  const preview = lastUserContent.slice(0, 240);
  const messageCount = (messages?.length ?? 0) + (prompt ? 1 : 0);

  await ref.set(
    {
      sessionId,
      messageCount,
      lastPromptPreview: preview,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
