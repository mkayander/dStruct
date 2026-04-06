import * as parserBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const codeRouter = createTRPCRouter({
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
