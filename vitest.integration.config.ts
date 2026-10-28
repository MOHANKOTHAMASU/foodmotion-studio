import { defineConfig } from "vitest/config";
import path from "node:path";

// Runs against a live local Supabase (pnpm db:start). Exercises RLS with real JWTs.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
