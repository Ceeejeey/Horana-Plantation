import type { Config } from "jest";

const config: Config = {
  displayName: "@horana/web",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@horana/shared$": "<rootDir>/../../packages/shared/src/index.ts",
  },
};

export default config;
