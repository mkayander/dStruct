import { spawn } from "node:child_process";
import path from "path";

const codeStr = `
x = 2
y = x ** 8
print(y)
`;

const child = spawn(`python`, [
  path.join(process.cwd(), "workers", "exec.py"),
  codeStr,
]);
child.stdout.setEncoding("utf-8");
child.stdout.on("data", (data) => {
  console.log("stdout: ", data.toString());
});

child.on("spawn", (...args) => {
  console.log("Spawn: ", ...args);
});
child.on("message", (...args) => console.log(...args));
child.on("error", (...args) => {
  console.error("Proc Error: ", ...args);
});
child.on("exit", (...args) => {
  console.log("Exit: ", ...args);
});
