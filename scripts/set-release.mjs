#!/usr/bin/env node
/**
 * Update or read Firestore appConfig/release.
 * Uses Firebase CLI login (firebase login) — no separate gcloud required.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const require = createRequire(import.meta.url);
const firebaseAuth = require("firebase-tools/lib/auth");
const firebaseDefaultCredentials = require("firebase-tools/lib/defaultCredentials");

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

function loadRootEnv() {
  const envPath = resolve(rootDir, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadRootEnv();

const DOC_PATH = "appConfig/release";
const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.VITE_FIREBASE_PROJECT_ID ??
  "annual-report-hpl";

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("-")));
const command = args[0]?.toLowerCase();

if (flags.has("--emulator")) {
  process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
}

const help = `
Release control — Firestore ${DOC_PATH}

Commands:
  on      Set released: true  (show full app)
  off     Set released: false (coming soon page)
  status  Print current released flag

Examples:
  npm run release:on
  npm run release:off
  npm run release:status

Emulator (no login needed):
  npm run release:on:emu
  npm run release:off:emu

Auth (pick one):
  1. firebase login          ← recommended (global Firebase CLI)
  2. firebase-service-account.json in project root (service account key)

Project: ${projectId}
`.trim();

function authHelp() {
  return `
Firebase credentials not found.

Run once:
  firebase login

Then check:
  firebase login:list

If already logged in, try:
  firebase login --reauth

Or place a service account JSON at:
  ${resolve(rootDir, "firebase-service-account.json")}
`.trim();
}

async function initFirebaseAdmin() {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    initializeApp({ projectId });
    return;
  }

  const serviceAccountPaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    resolve(rootDir, "firebase-service-account.json"),
    resolve(rootDir, "secrets/firebase-service-account.json"),
  ].filter((p) => typeof p === "string" && existsSync(p));

  if (serviceAccountPaths.length > 0) {
    const keyPath = serviceAccountPaths[0];
    const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id ?? projectId,
    });
    return;
  }

  if (await firebaseDefaultCredentials.hasDefaultCredentials()) {
    initializeApp({
      credential: applicationDefault(),
      projectId,
    });
    return;
  }

  const account = firebaseAuth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) {
    console.error(authHelp());
    process.exit(1);
  }

  const credPath =
    await firebaseDefaultCredentials.getCredentialPathAsync(account);
  if (!credPath) {
    console.error(authHelp());
    process.exit(1);
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
  initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

if (!command || command === "help" || flags.has("--help")) {
  console.log(help);
  process.exit(command ? 0 : 1);
}

if (!["on", "off", "status"].includes(command)) {
  console.error(`Unknown command: ${command}\n\n${help}`);
  process.exit(1);
}

try {
  await initFirebaseAdmin();
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Failed to initialize Firebase Admin.",
  );
  console.error(authHelp());
  process.exit(1);
}

const db = getFirestore();
const docRef = db.doc(DOC_PATH);

try {
  if (command === "status") {
    const snap = await docRef.get();
    if (!snap.exists) {
      console.log("Document missing — treated as released: false (coming soon)");
      console.log("Create with: npm run release:off");
      process.exit(0);
    }
    const { released, updatedAt } = snap.data();
    const updated =
      updatedAt?.toDate?.()?.toISOString?.() ?? String(updatedAt ?? "—");
    console.log(`released: ${released === true}`);
    console.log(`updatedAt: ${updated}`);
    console.log(
      released === true
        ? "→ Full app is LIVE"
        : "→ Coming Soon page is shown",
    );
    process.exit(0);
  }

  const released = command === "on";

  await docRef.set(
    {
      released,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const target = process.env.FIRESTORE_EMULATOR_HOST
    ? `emulator (${process.env.FIRESTORE_EMULATOR_HOST})`
    : `production (${projectId})`;

  console.log(`✓ ${DOC_PATH} updated on ${target}`);
  console.log(`  released: ${released}`);
  console.log(
    released
      ? "→ Full annual report app is now LIVE"
      : "→ Coming Soon page is now shown",
  );
  console.log("\nRefresh the browser — no redeploy needed.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nFirestore error: ${message}`);

  if (message.includes("Could not load the default credentials")) {
    console.error(authHelp());
  } else if (message.includes("PERMISSION_DENIED")) {
    console.error(
      "\nYour account needs Firestore write access. Use a project Owner/Editor or service account key.",
    );
  }

  process.exit(1);
}
