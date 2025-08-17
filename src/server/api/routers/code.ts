import { spawn } from "child_process";
import { join } from "path";
import * as parserBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

function formatPython(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Use black from the virtual environment
    const blackPath = join(process.cwd(), ".venv", "bin", "black");
    const black = spawn(blackPath, ["--quiet", "-"], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let formatted = "";
    let error = "";

    black.stdout.on("data", (data) => {
      formatted += data.toString();
    });

    black.stderr.on("data", (data) => {
      error += data.toString();
    });

    black.on("close", (code) => {
      if (code === 0) {
        resolve(formatted);
      } else {
        reject(new Error(error || "Failed to format Python code"));
      }
    });

    black.stdin.write(code);
    black.stdin.end();
  });
}

export const codeRouter = createTRPCRouter({
  formatPython: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const formatted = await formatPython(input.code);
        return { formatted };
      } catch (error) {
        console.error("Error formatting Python code:", error);
        return { formatted: input.code }; // Return original code on error
      }
    }),

  formatJavaScript: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const formatted = await prettier.format(input.code, {
          parser: "babel",
          plugins: [parserBabel.default, prettierPluginEstree.default],
        });
        return { formatted };
      } catch (error) {
        console.error("Error formatting JavaScript code:", error);
        return { formatted: input.code }; // Return original code on error
      }
    }),
});
