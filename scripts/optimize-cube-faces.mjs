#!/usr/bin/env node
/**
 * Resize cube-face source photos → WebP and upload to Firebase Storage.
 * Run once (or when source photos change):
 *
 *   npm run storage:optimize-cube-faces
 */
import { createRequire } from "node:module";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { OAuth2Client } from "google-auth-library";
import { Storage } from "@google-cloud/storage";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { getGlobalDefaultAccount, getAccessToken } = require("firebase-tools/lib/auth");
const scopes = require("firebase-tools/lib/scopes");

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const bucketName =
  process.env.FIREBASE_STORAGE_BUCKET ?? "annual-report-hpl.firebasestorage.app";
const MAX_EDGE = 1280;
const WEBP_QUALITY = 82;

const FACES = [
  {
    name: "front",
    source: "Financial Capital/DSC_0854 copy.jpg",
  },
  {
    name: "right",
    source: "Manufactured Capital/DJI_0398.jpg",
  },
  {
    name: "top",
    source: "Intellectual capital/Copy of 7R501750.jpg",
  },
  {
    name: "left",
    source: "Human Capital/C P 16.jpg",
  },
  {
    name: "bottom",
    source: "Social and Relationship/7R503738-Edit.jpg",
  },
  {
    name: "back",
    source: "Natural Capital/forest.jpg",
  },
];

function resolveCapitalPagesDir() {
  const candidates = [
    process.env.CAPITAL_PAGES,
    resolve(root, "../Capital pages"),
    resolve(homedir(), "Downloads/Capital pages"),
  ].filter(Boolean);

  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }

  throw new Error(
    "Capital pages folder not found. Set CAPITAL_PAGES=/path/to/Capital pages",
  );
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
    return new Storage({ projectId: "annual-report-hpl", authClient: oauth });
  }

  return new Storage({ projectId: "annual-report-hpl" });
}

async function main() {
  const capitalPages = resolveCapitalPagesDir();
  const workDir = join(root, ".tmp/cube-faces");
  rmSync(workDir, { recursive: true, force: true });
  mkdirSync(workDir, { recursive: true });

  console.log(`Sources: ${capitalPages}`);
  console.log(`Upload: gs://${bucketName}/assets/cube-faces/\n`);

  const storage = await createStorageClient();
  const bucket = storage.bucket(bucketName);

  for (const face of FACES) {
    const input = join(capitalPages, face.source);
    if (!existsSync(input)) {
      throw new Error(`Missing source image: ${input}`);
    }

    const output = join(workDir, `${face.name}.webp`);
    const inputMb = (statSync(input).size / (1024 * 1024)).toFixed(2);

    await sharp(input)
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(output);

    const outputMb = (statSync(output).size / (1024 * 1024)).toFixed(2);
    const dest = `assets/cube-faces/${face.name}.webp`;

    await bucket.upload(output, {
      destination: dest,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        contentType: "image/webp",
      },
    });

    console.log(`  ✓ ${face.name}: ${inputMb} MB → ${outputMb} MB WebP`);
  }

  rmSync(workDir, { recursive: true, force: true });
  console.log("\nDone. Redeploy hosting: firebase deploy --only hosting");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
