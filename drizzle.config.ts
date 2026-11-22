import { defineConfig } from "drizzle-kit";

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/engimart";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Neon migrations must use the direct (unpooled) connection, not PgBouncer.
    url: connectionString,
  },
});
