import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveCapitalPagesDir(): string {
  const candidates = [
    process.env.CAPITAL_PAGES,
    path.resolve(__dirname, "../../../Capital pages"),
    path.resolve(__dirname, "src/assets/capitals-cube"),
  ].filter((dir): dir is string => Boolean(dir));

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }

  return candidates[0] ?? path.resolve(__dirname, "../../../Capital pages");
}

/** Original Capital pages folder — sibling of repo, CAPITAL_PAGES env, or bundled assets. */
const capitalPagesDir = resolveCapitalPagesDir();

const functionsEmulatorOrigin =
  process.env.VITE_FUNCTIONS_EMULATOR_ORIGIN ?? "http://127.0.0.1:5001";
const firebaseProjectId =
  process.env.VITE_FIREBASE_PROJECT_ID ?? "annual-report-hpl";

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, "../..");
  const appDir = __dirname;
  // apps/web/.env overrides monorepo root .env (same keys)
  const env = { ...loadEnv(mode, rootDir, ""), ...loadEnv(mode, appDir, "") };

  return {
    // base: "/annual_report_view/",
    base: "/",
    envDir: appDir,
    plugins: [react(), tailwindcss()],
    define: Object.fromEntries(
      Object.entries(env)
        .filter(([key]) => key.startsWith("VITE_"))
        .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@capital-pages": capitalPagesDir,
        "@horana/shared": path.resolve(
          __dirname,
          "../../packages/shared/src/index.ts",
        ),
      },
    },
    build: {
      // Content-hash every asset so replaced source files get new URLs after deploy.
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    server: {
      port: 3000,
      fs: {
        allow: [rootDir, capitalPagesDir],
      },
      // Only used for Gemini chat when the Functions emulator is running (port 5001).
      proxy: {
        "/api": {
          target: functionsEmulatorOrigin,
          changeOrigin: true,
          // path is e.g. /api/gemini/chat → function name "api" + express route
          rewrite: (requestPath) =>
            `/${firebaseProjectId}/us-central1/api${requestPath}`,
        },
      },
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
