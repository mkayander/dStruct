/**
 * Manual smoke test for the Pyodide Python runner.
 *
 * Run with:
 *   Open the browser console on any dStruct page and paste:
 *
 *     import("#/features/codeRunner/lib/pythonRunner").then(async ({ pythonRunner }) => {
 *       console.log("Initializing Pyodide...");
 *       await pythonRunner.init();
 *       console.log("Pyodide ready!");
 *
 *       // Test 1: simple return
 *       const r1 = await pythonRunner.run("def solution():\n  return 2 + 2");
 *       console.log("Test 1 (return 4):", r1);
 *
 *       // Test 2: print + list tracking
 *       const r2 = await pythonRunner.run(
 *         "def solution():\\n  nums = [1,2,3]\\n  print(sum(nums))\\n  return nums"
 *       );
 *       console.log("Test 2 (list + print):", r2);
 *
 *       console.log("Smoke tests passed!");
 *     });
 *
 * Or import this module in a Next.js page component for a dedicated test route.
 */

export const PYTHON_SMOKE_SNIPPETS = [
  {
    label: "simple return",
    code: `def solution():\n    return 2 + 2`,
    expectOutput: "",
  },
  {
    label: "print and list tracking",
    code: `def solution():\n    nums = [1, 2, 3]\n    print(sum(nums))\n    return nums`,
    expectOutput: "6\n",
  },
] as const;
