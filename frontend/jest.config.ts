import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  verbose: true,
  silent: true,
  collectCoverageFrom: ["src/**"],
};

export default createJestConfig(config);
