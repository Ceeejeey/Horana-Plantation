#!/usr/bin/env node
/**
 * Upload apps/web/src/assets/** to Firebase Storage (assets/ prefix).
 * Deletes local files after a successful upload.
 *
 * Auth (first match wins):
 *   1. firebase-service-account.json at repo root
 *   2. Firebase CLI session (`firebase login`)
 *   3. Application Default Credentials
 *
 *   npm run storage:upload
 *   npm run storage:upload -- --dry-run
 */
import { createRequire } from "node:module";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { OAuth2Client } from "google-auth-library";
import { Storage } from "@google-cloud/storage";

const require = createRequire(import.meta.url);
const { getGlobalDefaultAccount, getAccessToken } = require("firebase-tools/lib/auth");
const scopes = require("firebase-tools/lib/scopes");

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const assetsDir = resolve(root, "apps/web/src/assets");
const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET ?? "annual-report-hpl.firebasestorage.app";
const dryRun = process.argv.includes("--dry-run");

function collectFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.name === ".gitkeep" || entry.name === "README.md") continue;
    if (entry.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function createStorageClient() {
  const serviceAccountPath = resolve(root, "firebase-service-account.json");
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    return new Storage({
      projectId: serviceAccount.project_id,
      credentials: serviceAccount,
    });
  }

  const account = getGlobalDefaultAccount();
  if (account?.tokens?.refresh_token) {
    const tokens = await getAccessToken(account.tokens.refresh_token, [
      scopes.CLOUD_PLATFORM,
    ]);
    const oauth = new OAuth2Client();
    oauth.setCredentials({
      access_token: tokens.access_token,
      refresh_token: account.tokens.refresh_token,
    });
    return new Storage({
      projectId: "annual-report-hpl",
      authClient: oauth,
    });
  }

  return new Storage({ projectId: "annual-report-hpl" });
}

async function main() {
  if (!existsSync(assetsDir)) {
    console.log("apps/web/src/assets does not exist — nothing to upload.");
    return;
  }

  const storage = await createStorageClient();
  const bucket = storage.bucket(bucketName);
  const files = collectFiles(assetsDir);

  if (files.length === 0) {
    console.log("No files under apps/web/src/assets — nothing to upload.");
    return;
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Uploading ${files.length} file(s) to gs://${bucketName}/assets/ …\n`,
  );

  for (const absolutePath of files) {
    const rel = relative(assetsDir, absolutePath).replace(/\\/g, "/");
    const storagePath = `assets/${rel}`;
    const sizeMb = (statSync(absolutePath).size / (1024 * 1024)).toFixed(2);

    if (dryRun) {
      console.log(`  would upload ${rel} (${sizeMb} MB) → ${storagePath}`);
      continue;
    }

    await bucket.upload(absolutePath, {
      destination: storagePath,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
    console.log(`  ✓ ${rel} (${sizeMb} MB)`);
  }

  if (dryRun) {
    console.log("\nDry run complete — no files uploaded or deleted.");
    return;
  }

  console.log("\nDeleting local copies …");
  for (const absolutePath of files) {
    unlinkSync(absolutePath);
    console.log(`  removed ${relative(assetsDir, absolutePath)}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
