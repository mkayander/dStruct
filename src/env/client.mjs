// @ts-check
import { clientEnv, clientSchema } from "./schema.mjs";

/** @type {typeof clientEnv} */
let validatedEnv = clientEnv;

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!process.env.SKIP_ENV_VALIDATION) {
  const _clientEnv = clientSchema.safeParse(clientEnv);

  if (!_clientEnv.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(_clientEnv.error.format()),
      "\nSet SKIP_ENV_VALIDATION=1 to bypass this check (not recommended for production).",
    );
    throw new Error("Invalid environment variables");
  }

  for (let key of Object.keys(_clientEnv.data)) {
    if (!key.startsWith("NEXT_PUBLIC_")) {
      console.warn(
        `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
      );
      throw new Error("Invalid public environment variable name");
    }
  }

  validatedEnv = _clientEnv.data;
}

export const env = validatedEnv;
