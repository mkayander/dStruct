import { createClient } from "@vercel/kv";

export const kv = createClient({
  url: process.env.UPSTASH_KV_REST_API_URL,
  token: process.env.UPSTASH_KV_REST_API_TOKEN,
});
