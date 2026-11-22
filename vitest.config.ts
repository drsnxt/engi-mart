import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Load .env so API integration tests use the Neon connection.
    setupFiles: ["dotenv/config"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
