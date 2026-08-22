import { execSync } from "node:child_process";

/** Best-effort PostgreSQL for local e2e (playground metadata, tRPC). */
export default async function globalSetup(): Promise<void> {
  try {
    execSync("sudo service postgresql start", { stdio: "ignore" });
  } catch {
    // Postgres may already be running or unavailable in some environments.
  }
}
