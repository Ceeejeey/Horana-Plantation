import type { Request, Response } from "express";
import type { ChatMessage, GeminiChatRequest } from "@horana/shared";
import { createGeminiClient, SYSTEM_INSTRUCTION } from "../config/gemini";
import { persistChatSession } from "../services/firestore";
import { randomUUID } from "crypto";

const GRAPH_KEYWORD =
  /graph|chart|plot|ප්‍රස්ථාරය|ග්‍රාෆ්|චාට්/i;

function emulateResponse(searchString: string): string {
  const hasGraphKeyword = GRAPH_KEYWORD.test(searchString);

  if (hasGraphKeyword) {
    return "Certainly! I have generated a dynamic comparison graph demonstrating our year-over-year financial performance.\n\n<render-comparison-graph />\n\nAs shown in the graph, our Net Profit has escalated from LKR 420 Million last year to LKR 680 Million this fiscal year. This 61.9% uptick is driven by Pekoe export premium margins and automation of our Smart weighing grids.";
  }

  return "Ayubowan! I am the Horana Plantations PLC AI Advisor. Our systemic balance is monitored in real-time across six capitals. Ask me about our performance metrics, or ask me for a 'graph' to visualize our profits!";
}

function buildContents(
  messages: ChatMessage[] | undefined,
  prompt: string | undefined,
) {
  const contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }> = [];

  if (messages?.length) {
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  if (prompt) {
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });
  }

  return contents;
}

export async function handleGeminiChat(
  req: Request,
  res: Response,
): Promise<void> {
  const body = req.body as GeminiChatRequest;
  const { messages, prompt } = body;
  let { sessionId } = body;

  if (!prompt && (!messages || messages.length === 0)) {
    res.status(400).json({ error: "No query or message exchange provided." });
    return;
  }

  if (!sessionId) {
    sessionId = randomUUID();
  }

  try {
    await persistChatSession(sessionId, messages, prompt);
  } catch (error) {
    console.warn("Firestore session persist skipped:", error);
  }

  const ai = createGeminiClient();
  const searchString = (
    prompt ??
    messages?.[messages.length - 1]?.content ??
    ""
  ).toLowerCase();

  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Emulating server response...");
    const text = emulateResponse(searchString);
    res.json({ text, sessionId });
    return;
  }

  try {
    const contents = buildContents(messages, prompt);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.25,
      },
    });

    res.json({
      text: response.text ?? "No response text was generated.",
      sessionId,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error.";
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: message });
  }
}
