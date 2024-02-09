import { execSync } from "child_process";
import fs from "fs/promises";

import { requestWorkerAction } from "#/workers/codeExecWorkerInterface";

describe("codeExec.worker", () => {
  let worker: Worker;
  beforeAll(async () => {
    execSync(
      "pnpm exec esbuild src/workers/codeExec.worker.ts --bundle --platform=browser --outfile=src/workers/codeExec.worker.js",
    );
    worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [await fs.readFile("./src/workers/codeExec.worker.js", "utf-8")],
          { type: "application/javascript" },
        ),
      ),
    );
  });

  it("should run the code and return the result", async () => {
    const code = `
      function run() {
        return 2 + 2;
      }
      return run;`;
    const expectedResult = "4";

    const response = await requestWorkerAction(worker, "run", {
      type: "run",
      code: String(code),
      caseArgs: [],
      arrayStore: {},
      treeStore: {},
    });

    expect(response.type).toBe("run");
    expect(response.output).toBe(expectedResult);
  });

  it("should run the benchmark and return the results", async () => {
    const code = `
      function run() {
        return 2 + 2;
      }
      return run;`;

    const response = await requestWorkerAction(worker, "benchmark", {
      type: "benchmark",
      code: String(code),
      input: [],
      count: 128,
    });

    expect(response.type).toBe("benchmark");
    expect(response.averageTime).toBeLessThan(1);
    expect(response.medianTime).toBeLessThan(1);
    expect(response.p75Time).toBeLessThan(1);
    expect(response.p90Time).toBeLessThan(1);
    expect(response.p99Time).toBeLessThan(1);
  });

  it("should throw an error if the code is invalid", async () => {
    const code = `
      function run() {
        return JSON.parse("=>");
      }
      return run;`;

    try {
      await requestWorkerAction(worker, "run", {
        type: "run",
        code: String(code),
        caseArgs: [],
        arrayStore: {},
        treeStore: {},
      });
    } catch (e: any) {
      expect(e).toBeTruthy();
    }
  });

  // afterAll(() => {
  //   worker.terminate();
  // });
});
