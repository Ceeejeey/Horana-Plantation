#!/usr/bin/env node
/** Sync GEMINI_API_KEY from repo root .env → packages/functions/.env.<projectId> */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const projectId = "annual-report-hpl";
const rootEnv = resolve(root, ".env");
const outPath = resolve(root, "packages/functions", `.env.${projectId}`);

function parseEnv(text) {
  const map = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    map[key] = val;
  }
  return map;
}

let geminiKey = process.env.GEMINI_API_KEY ?? "";

if (!geminiKey && existsSync(rootEnv)) {
  const parsed = parseEnv(readFileSync(rootEnv, "utf8"));
  geminiKey = parsed.GEMINI_API_KEY ?? "";
}

if (!geminiKey || geminiKey === "MY_GEMINI_API_KEY") {
  geminiKey = "deploy-placeholder-set-in-firebase-console";
  console.warn(
    "Warning: GEMINI_API_KEY not set — using placeholder so deploy can finish. Set a real key in .env or Firebase Console → Functions → Environment.",
  );
}

writeFileSync(outPath, `GEMINI_API_KEY=${geminiKey}\n`, "utf8");
console.log(`Wrote ${outPath}`);
