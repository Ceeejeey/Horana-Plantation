import type { Request, Response } from "express";
import { getReleaseStatus } from "../services/release";

export async function handleGetReleaseStatus(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const status = await getReleaseStatus();
    res.json(status);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to read release status.";
    console.error("Release status error:", error);
    res.status(500).json({ error: message });
  }
}
