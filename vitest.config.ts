import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
});
