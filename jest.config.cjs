const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "^uuid$": require.resolve("uuid"),
  },
  transform: {
    "node_modules/superjson/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!superjson/.*)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
