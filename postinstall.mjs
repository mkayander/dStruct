import { execSync } from "child_process";

console.time("postinstall");

const isCI = process.env.CI === "true";

const prismaCommand = isCI
  ? "pnpm run prisma:generate-accelerate"
  : "pnpm run prisma:generate";

const graphqlCommand = "pnpm run generate-graphql";

const commands = [prismaCommand, graphqlCommand];

execSync(commands.join(" && "), { stdio: "inherit" });

console.timeEnd("postinstall");
