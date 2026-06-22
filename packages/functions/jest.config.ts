import type { Config } from "jest";

const config: Config = {
  displayName: "@horana/functions",
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@horana/shared$": "<rootDir>/../shared/src/index.ts",
  },
};

export default config;
