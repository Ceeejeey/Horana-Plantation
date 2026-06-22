import type { Config } from "jest";

const config: Config = {
  projects: [
    "<rootDir>/packages/shared",
    "<rootDir>/packages/functions",
    "<rootDir>/apps/web",
  ],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/lib/**",
  ],
};

export default config;
