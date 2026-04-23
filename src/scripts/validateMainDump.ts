/**
 * Validates public-dumps/main.json before loadMainDump / prod push.
 *
 * Run: `pnpm validate-main-dump` or `pnpm exec tsx src/scripts/validateMainDump.ts [path]`
 */
import { promises as fs } from "fs";
import { join } from "path";

type DumpSolution = {
  id: string;
  projectId: string;
  slug: string;
  pythonCode: string | null;
};

type DumpTestCase = {
  id: string;
  projectId: string;
};

type DumpProject = { id: string };

type DumpFile = {
  projects: Record<string, DumpProject>;
  testCases: Record<string, DumpTestCase>;
  solutions: Record<string, DumpSolution>;
};

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main(): Promise<void> {
  const dumpPath =
    process.argv[2] ?? join(process.cwd(), "public-dumps/main.json");
  let raw: string;
  try {
    raw = await fs.readFile(dumpPath, "utf8");
  } catch {
    fail(`validateMainDump: cannot read ${dumpPath}`);
  }

  let data: DumpFile;
  try {
    data = JSON.parse(raw) as DumpFile;
  } catch {
    fail("validateMainDump: invalid JSON");
  }

  if (!data.projects || typeof data.projects !== "object") {
    fail("validateMainDump: missing projects object");
  }
  if (!data.testCases || typeof data.testCases !== "object") {
    fail("validateMainDump: missing testCases object");
  }
  if (!data.solutions || typeof data.solutions !== "object") {
    fail("validateMainDump: missing solutions object");
  }

  for (const testCase of Object.values(data.testCases)) {
    if (!data.projects[testCase.projectId]) {
      fail(
        `validateMainDump: test case ${testCase.id} references unknown project ${testCase.projectId}`,
      );
    }
  }

  const solutions = Object.values(data.solutions);
  let missingPython = 0;
  let invalidEntry = 0;

  for (const solution of solutions) {
    if (!data.projects[solution.projectId]) {
      fail(
        `validateMainDump: solution ${solution.id} references unknown project ${solution.projectId}`,
      );
    }

    const python = solution.pythonCode;
    if (python === null || python === undefined) {
      missingPython += 1;
      continue;
    }
    if (typeof python !== "string" || python.trim() === "") {
      missingPython += 1;
      continue;
    }

    const normalized = python.replace(/\r\n/g, "\n").trimStart();
    if (!/^def [a-zA-Z_][a-zA-Z0-9_]*\s*\(/m.test(normalized)) {
      invalidEntry += 1;
    }
  }

  if (missingPython > 0) {
    fail(
      `validateMainDump: ${missingPython} solution(s) missing non-empty pythonCode`,
    );
  }

  if (invalidEntry > 0) {
    fail(
      `validateMainDump: ${invalidEntry} solution(s) pythonCode does not start with a def entry function`,
    );
  }

  console.log(
    `validateMainDump: OK — ${solutions.length} solutions, pythonCode present and entry def-shaped`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
