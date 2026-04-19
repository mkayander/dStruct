/**
 * Fills empty `pythonCode` on playground solutions in public-dumps/main.json.
 *
 * Uses the first test case per project (lowest order, then slug) to pick parameter
 * names and types. Prefers index loops over `for x in arr` when generating array stubs
 * so behavior is obvious; full solutions may use iteration (TrackedList.__iter__ is fixed).
 *
 * Run: `pnpm fill-dump-python` or `pnpm exec tsx src/scripts/fillMainDumpPythonPlaceholders.ts [path]`
 */
import { promises as fs } from "fs";
import { join } from "path";

type ArgType = string;

type DumpArg = {
  name: string;
  type: ArgType;
  order: number;
};

type DumpTestCase = {
  id: string;
  projectId: string;
  slug: string;
  order: number;
  args: Record<string, DumpArg>;
};

type DumpSolution = {
  id: string;
  projectId: string;
  slug: string;
  pythonCode: string | null;
  updatedAt: string;
};

type DumpProject = {
  id: string;
  category: string;
};

type DumpFile = {
  projects: Record<string, DumpProject>;
  testCases: Record<string, DumpTestCase>;
  solutions: Record<string, DumpSolution>;
};

const PYTHON_KEYWORDS = new Set([
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "False",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "None",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "True",
  "try",
  "while",
  "with",
  "yield",
]);

function sanitizePythonIdentifier(name: string, fallback: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9_]/g, "_");
  const base = cleaned.length > 0 ? cleaned : fallback;
  const withPrefix = /^[0-9]/.test(base) ? `arg_${base}` : base;
  if (PYTHON_KEYWORDS.has(withPrefix)) {
    return `${withPrefix}_`;
  }
  return withPrefix;
}

function sortedArgs(testCase: DumpTestCase): DumpArg[] {
  return Object.values(testCase.args ?? {}).toSorted((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.name.localeCompare(right.name);
  });
}

function pickReferenceTestCase(
  testCases: DumpTestCase[],
): DumpTestCase | undefined {
  return testCases.toSorted((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.slug.localeCompare(right.slug);
  })[0];
}

function buildPythonForArgs(args: DumpArg[]): string {
  if (args.length === 0) {
    return "def solve():\r\n  return None\r\n";
  }

  if (args.length === 1) {
    const only = args[0];
    const param = sanitizePythonIdentifier(only.name, "arg0");
    switch (only.type) {
      case "binaryTree":
        return [
          `def run(${param}):`,
          `  if ${param} is None:`,
          `    return 0`,
          `  left_sum = run(${param}.left)`,
          `  right_sum = run(${param}.right)`,
          `  return ${param}.val + left_sum + right_sum`,
          "",
        ].join("\r\n");
      case "linkedList":
        return [
          `def run(${param}):`,
          `  slow = ${param}`,
          `  fast = ${param}`,
          `  while fast and fast.next:`,
          `    slow = slow.next`,
          `    fast = fast.next.next`,
          `  return slow`,
          "",
        ].join("\r\n");
      case "array":
      case "matrix":
        return [
          `def run(${param}):`,
          `  total = 0`,
          `  for idx in range(len(${param})): `,
          `    total += ${param}[idx]`,
          `  return total`,
          "",
        ]
          .join("\r\n")
          .replace(
            `for idx in range(len(${param})): `,
            `for idx in range(len(${param})):\r\n`,
          );
      case "graph":
        return `def run(${param}):\r\n  return ${param}\r\n`;
      case "string":
        return `def run(${param}):\r\n  return ${param}\r\n`;
      case "number":
        return `def run(${param}):\r\n  return ${param}\r\n`;
      case "boolean":
        return `def run(${param}):\r\n  return ${param}\r\n`;
      default:
        return `def run(${param}):\r\n  return ${param}\r\n`;
    }
  }

  const params = args.map((arg, index) =>
    sanitizePythonIdentifier(arg.name, `arg${index}`),
  );
  const first = params[0];
  const signature = params.join(", ");
  return `def solve(${signature}):\r\n  return ${first}\r\n`;
}

function isEmptyPython(code: string | null | undefined): boolean {
  return code === null || code === undefined || code.trim() === "";
}

async function main(): Promise<void> {
  const dumpPath =
    process.argv[2] ?? join(process.cwd(), "public-dumps/main.json");
  const raw = await fs.readFile(dumpPath, "utf8");
  const data = JSON.parse(raw) as DumpFile;

  const testCasesByProject = new Map<string, DumpTestCase[]>();
  for (const testCase of Object.values(data.testCases)) {
    const list = testCasesByProject.get(testCase.projectId) ?? [];
    list.push(testCase);
    testCasesByProject.set(testCase.projectId, list);
  }

  const now = new Date().toISOString();
  let updatedCount = 0;

  for (const solution of Object.values(data.solutions)) {
    if (!isEmptyPython(solution.pythonCode)) continue;

    const testCases = testCasesByProject.get(solution.projectId);
    const reference = testCases ? pickReferenceTestCase(testCases) : undefined;
    const args = reference ? sortedArgs(reference) : [];

    solution.pythonCode = buildPythonForArgs(args);
    solution.updatedAt = now;
    updatedCount += 1;
  }

  await fs.writeFile(dumpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated pythonCode on ${updatedCount} solutions in ${dumpPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
