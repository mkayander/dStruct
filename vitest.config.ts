import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    globals: true,
    env: {
      SKIP_ENV_VALIDATION: "1",
    },
  },
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
});
