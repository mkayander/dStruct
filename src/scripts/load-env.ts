// This file must be imported first to load .env.local before any other modules
import { config } from "dotenv";
import { resolve } from "path";

// Load .env first, then .env.local to override it
// This ensures .env.local takes precedence over .env
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });
