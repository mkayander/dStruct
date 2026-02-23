/**
 * Build-time script: generates the date serialization extension from the Prisma schema.
 * Runs during `prisma generate`—no runtime schema parsing.
 *
 * Finds all models with createdAt/updatedAt DateTime fields and emits the result extension.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, "..", "schema.prisma");
const OUTPUT_PATH = join(
  __dirname,
  "..",
  "..",
  "src",
  "server",
  "db",
  "dateSerialization",
  "extension.ts",
);

const DATE_FIELDS = ["createdAt", "updatedAt"] as const;

function parseSchema(schemaContent: string): Map<string, Set<string>> {
  const models = new Map<string, Set<string>>();
  let currentModel: string | null = null;

  for (const line of schemaContent.split("\n")) {
    const modelMatch = line.match(/^model\s+(\w+)\s*\{/);
    const modelName = modelMatch?.[1];
    if (modelName) {
      currentModel = modelName;
      models.set(currentModel, new Set());
      continue;
    }

    if (currentModel && line.trim() === "}") {
      currentModel = null;
      continue;
    }

    if (currentModel) {
      const fieldMatch = line.match(/^\s*(\w+)\s+DateTime/);
      const fieldName = fieldMatch?.[1];
      if (
        fieldName &&
        DATE_FIELDS.includes(fieldName as (typeof DATE_FIELDS)[number])
      ) {
        models.get(currentModel)?.add(fieldName);
      }
    }
  }

  return models;
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateExtension(models: Map<string, Set<string>>): string {
  const entries: string[] = [];

  for (const [modelName, fields] of models) {
    if (fields.size === 0) continue;

    const modelKey = toCamelCase(modelName);
    const fieldEntries = Array.from(fields)
      .map((f) => `        ${f}: dateField("${f}"),`)
      .join("\n");

    entries.push(`      ${modelKey}: {
${fieldEntries}
      },`);
  }

  return `import { Prisma } from "@prisma/client/extension";

const dateField = <K extends "createdAt" | "updatedAt">(field: K) => ({
  needs: { [field]: true } as { [P in K]: true },
  compute(obj: Record<K, Date>) {
    const value = obj[field];
    return value instanceof Date ? value.toISOString() : value;
  },
});

/**
 * Result extension that converts createdAt and updatedAt to ISO strings.
 * Prisma infers the updated types (string instead of Date).
 * Generated from schema by prisma/scripts/generate-date-serialization.ts
 */
export function createDateSerializationExtension() {
  return Prisma.defineExtension({
    name: "date-serialization",
    result: {
${entries.join("\n\n")}
    },
  });
}
`;
}

const schema = readFileSync(SCHEMA_PATH, "utf-8");
const models = parseSchema(schema);
const output = generateExtension(models);
writeFileSync(OUTPUT_PATH, output, "utf-8");
console.log(
  "[generate-date-serialization] Wrote extension for models:",
  [...models.keys()].join(", "),
);
