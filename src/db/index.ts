import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add the pooled Neon connection string to .env locally, or to the Netlify environment variables."
  );
}

// Neon HTTP driver: no persistent socket, ideal for serverless runtimes such as Netlify Functions.
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export type Database = typeof db;
export * from "./schema";
