// @ts-check

/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { env as clientEnv, formatErrors } from "./client.mjs";
import { serverSchema } from "./schema.mjs";

/** @type {typeof process.env & typeof clientEnv} */
let validatedEnv = { ...process.env, ...clientEnv };

if (!process.env.SKIP_ENV_VALIDATION) {
  const _serverEnv = serverSchema.safeParse(process.env);

  if (!_serverEnv.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(_serverEnv.error.format()),
      "\nSet SKIP_ENV_VALIDATION=1 to bypass this check (not recommended for production).",
    );
    throw new Error("Invalid environment variables");
  }

  for (let key of Object.keys(_serverEnv.data)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      console.warn("❌ You are exposing a server-side env-variable:", key);
      throw new Error("You are exposing a server-side env-variable");
    }
  }

  validatedEnv = { ..._serverEnv.data, ...clientEnv };
}

export const env = validatedEnv;
