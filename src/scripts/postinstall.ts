import { exec, execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

// Virtual environment path relative to project root
const VENV_PATH = join(process.cwd(), ".venv");
const VENV_BIN = join(VENV_PATH, "bin");
const VENV_PIP = join(VENV_BIN, "pip");

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

async function createVirtualEnvironment() {
  try {
    console.log("🔧 Creating virtual environment...");

    // Create .venv directory if it doesn't exist
    if (!existsSync(VENV_PATH)) {
      mkdirSync(VENV_PATH, { recursive: true });
    }

    // Create virtual environment
    await execAsync(`python3 -m venv ${VENV_PATH}`);
    console.log("✅ Virtual environment created successfully");
  } catch (error) {
    console.error(
      "❌ Failed to create virtual environment:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

async function installBlack() {
  try {
    console.log("📦 Installing Black formatter in virtual environment...");

    // Install black in the virtual environment
    await execAsync(`${VENV_PIP} install black`);
    console.log("✅ Black formatter installed successfully");

    // Create a symlink or script to make black easily accessible
    const blackPath = join(VENV_BIN, "black");
    console.log(`📍 Black is available at: ${blackPath}`);
    console.log("💡 You can run it with: .venv/bin/black <file>");
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
  if (
    process.env.CI === "true" ||
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL
  ) {
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

  // Create virtual environment if it doesn't exist
  if (!existsSync(VENV_PATH)) {
    await createVirtualEnvironment();
  } else {
    console.log("✅ Virtual environment already exists");
  }

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
