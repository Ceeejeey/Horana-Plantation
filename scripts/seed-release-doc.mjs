#!/usr/bin/env node
/** @deprecated Use: npm run release:on | release:off */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const released = process.argv.some((a) => a.includes("released=true"));
const script = resolve(dirname(fileURLToPath(import.meta.url)), "set-release.mjs");
const result = spawnSync(process.execPath, [script, released ? "on" : "off"], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
