import http from "http";
import { spawn } from "node:child_process";
import path from "path";

const PORT = 8333;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    console.log(req.headers);
    console.log(req.method);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      console.log(body);
      const data = JSON.parse(body);
      console.log(data);

      const child = spawn(`python`, [
        path.join(process.cwd(), "workers", "exec.py"),
        data.code,
      ]);
      child.stdout.setEncoding("utf-8");

      let result = "";
      child.stdout.on("data", (data) => {
        const chunk = data.toString();
        result += chunk;
        console.log("stdout: ", chunk);
      });

      child.on("error", (...args) => {
        console.error("Proc Error: ", ...args);
        res.end();
      });
      child.on("exit", (...args) => {
        console.log("Exit: ", ...args);
        res.write(
          JSON.stringify({
            result,
            url: req.url,
            data,
          }),
        );
        res.end();
      });
    });
  })
  .listen(PORT);

console.log(`Server is running on port ${PORT}`);
