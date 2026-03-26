import { Redis } from "@upstash/redis";

/**
 * Entity index storage uses Upstash Redis REST (formerly exposed via @vercel/kv).
 * Env fallbacks match Vercel / Upstash integration naming.
 */
export const kv = new Redis({
  url:
    process.env.UPSTASH_KV_REST_API_URL ??
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL,
  token:
    process.env.UPSTASH_KV_REST_API_TOKEN ??
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN,
});
