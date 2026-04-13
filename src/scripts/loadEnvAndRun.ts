/**
 * Loads `.env` then `.env.local` (later overrides) into the environment and runs a shell command.
 * Replaces `dotenv -e .env -e .env.local` without a trailing command, which exits with code 1.
 */
import { spawnSync } from "child_process";
import { parse } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

function loadRepoEnv(): NodeJS.ProcessEnv {
  const cwd = process.cwd();
  const envPath = join(cwd, ".env");
  const localPath = join(cwd, ".env.local");

  const fromDotEnv = existsSync(envPath)
    ? parse(readFileSync(envPath, "utf8"))
    : {};
  const fromLocal = existsSync(localPath)
    ? parse(readFileSync(localPath, "utf8"))
    : {};

  // `.env.local` overrides `.env`; the shell / parent process overrides both.
  return { ...fromDotEnv, ...fromLocal, ...process.env };
}

const dashIndex = process.argv.indexOf("--");
const commandParts = dashIndex === -1 ? [] : process.argv.slice(dashIndex + 1);

if (commandParts.length === 0) {
  console.error(
    "loadEnvAndRun: missing command after --. Example: pnpm run load-env -- prisma generate",
  );
  process.exit(1);
}

const command = commandParts.join(" ");
const envWithRepoFiles = loadRepoEnv();

const child = spawnSync(command, {
  stdio: "inherit",
  env: envWithRepoFiles,
  shell: true,
});

const exitCode = child.status ?? 1;
process.exit(exitCode);
