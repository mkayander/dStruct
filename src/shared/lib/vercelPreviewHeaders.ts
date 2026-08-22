/** Headers for Vercel Deployment Protection bypass (CI / preview smoke). */
export function vercelProtectionBypassHeaders(): Record<string, string> {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!secret) {
    return {};
  }
  return { "x-vercel-protection-bypass": secret };
}
