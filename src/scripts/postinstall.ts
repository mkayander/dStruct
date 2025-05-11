import { exec, execSync } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkPython() {
  try {
    await execAsync("python --version");
    return true;
  } catch (error) {
    try {
      await execAsync("python3 --version");
      return true;
    } catch (error) {
      return false;
    }
  }
}

async function installBlack() {
  try {
    await execAsync("pip install black");
    console.log("✅ Black formatter installed successfully");
  } catch (error) {
    console.error(
      "❌ Failed to install Black formatter:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

function runPrismaAndGraphQL() {
  const isCI = process.env.CI === "true";
  const prismaCommand = isCI
    ? "pnpm run prisma:generate-accelerate"
    : "pnpm run prisma:generate";
  const graphqlCommand = "pnpm run generate-graphql";
  const commands = [prismaCommand, graphqlCommand];

  execSync(commands.join(" && "), { stdio: "inherit" });
}

async function main() {
  console.time("postinstall");

  console.log("🔍 Running Prisma and GraphQL generation...");
  runPrismaAndGraphQL();

  // Skip Python checks in CI/server environments
  if (process.env.CI === "true" || process.env.NODE_ENV === "production") {
    console.log("⏩ Skipping Python checks in CI/server environment");
    console.timeEnd("postinstall");
    return;
  }

  console.log("🔍 Checking Python installation...");
  const hasPython = await checkPython();

  if (!hasPython) {
    console.error(
      "❌ Python is not installed. Please install Python 3.7 or later.",
    );
    console.error(
      "Visit https://www.python.org/downloads/ to download Python.",
    );
    process.exit(1);
  }

  console.log("✅ Python is installed");
  console.log("📦 Installing Black formatter...");
  await installBlack();

  console.timeEnd("postinstall");
}

main().catch((error) => {
  console.error(
    "❌ Postinstall script failed:",
    error instanceof Error ? error.message : String(error),
  );
  process.exit(1);
});
