import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Load .env.local (drizzle-kit does not read it automatically) without adding
// a dotenv dependency.
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // .env.local is optional when env vars are already set in the shell.
}

// `generate` only reads the schema (no connection needed).
// `migrate` requires DATABASE_URL to connect to Postgres.
const url = process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
