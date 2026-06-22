import cors from "cors";
import express from "express";
import { handleGeminiChat } from "./api/gemini";
import { handleGetReleaseStatus } from "./api/release";

export function createApp(): express.Express {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "horana-functions" });
  });

  app.get("/api/app/release-status", (req, res) => {
    void handleGetReleaseStatus(req, res);
  });

  app.post("/api/gemini/chat", (req, res) => {
    void handleGeminiChat(req, res);
  });

  return app;
}
