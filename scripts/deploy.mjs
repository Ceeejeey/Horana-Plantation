#!/usr/bin/env node
/**
 * Build + deploy to Firebase (Hosting, Functions, Firestore rules).
 * Requires: firebase login, .env at repo root for Vite build.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const onlyIdx = process.argv.indexOf("--only");
const onlyTarget =
  onlyIdx >= 0 ? process.argv[onlyIdx + 1]?.replace(/^--only=/, "") : undefined;

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureEnv() {
  const envPath = resolve(root, ".env");
  const examplePath = resolve(root, ".env.example");
  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log("Created .env from .env.example (required for production web build).\n");
  }
  if (!existsSync(envPath)) {
    console.error("Missing .env — copy .env.example to .env and set Firebase / Gemini keys.");
    process.exit(1);
  }
}

function ensureFunctionsEnv() {
  run("node", [resolve(root, "scripts/sync-functions-env.mjs")]);
}

console.log("=== Horana Plantations — Firebase deploy ===\n");

run("npx", ["firebase", "--version"]);

const loginCheck = spawnSync("npx", ["firebase", "projects:list"], {
  cwd: root,
  encoding: "utf8",
});
if (loginCheck.status !== 0) {
  console.error(
    "\nFirebase CLI is not authenticated. Run:\n\n  firebase login --reauth\n  firebase use annual-report-hpl\n",
  );
  process.exit(1);
}
console.log("Firebase CLI: authenticated\n");

ensureEnv();
ensureFunctionsEnv();

if (!onlyTarget) {
  console.log("\n--- Building monorepo (clean web dist first) ---\n");
  run("npm", ["run", "clean", "-w", "@horana/web"]);
  run("npm", ["run", "build"]);
}

const deployArgs = ["firebase", "deploy"];
if (onlyTarget) {
  deployArgs.push("--only", onlyTarget);
} else {
  deployArgs.push("--only", "hosting,functions,firestore");
}

console.log(`\n--- Deploying (${deployArgs.join(" ")}) ---\n`);
const deployResult = spawnSync("npx", deployArgs, { cwd: root, stdio: "inherit" });

console.log("\n--- Live smoke tests ---\n");
const testResult = spawnSync("node", [resolve(root, "scripts/test-deploy.mjs")], {
  cwd: root,
  stdio: "inherit",
});

if (deployResult.status !== 0) {
  console.error(
    "\nDeploy reported errors. If Functions failed, enable App Engine for the project:",
  );
  console.error(
    "  https://console.cloud.google.com/appengine?project=annual-report-hpl",
  );
  console.error("  Then run: npm run firebase:deploy:functions\n");
  process.exit(deployResult.status ?? 1);
}

process.exit(testResult.status ?? 0);
