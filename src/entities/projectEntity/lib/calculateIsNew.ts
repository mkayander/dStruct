import { getAll } from "@vercel/edge-config";

/**
 * Gets the newProjectMarginMs value from edge config
 * @returns The margin in milliseconds, or undefined if not configured
 */
export const getNewProjectMarginMs = async (): Promise<number | undefined> => {
  try {
    const config = await getAll();
    const marginMs = config?.newProjectMarginMs;
    return typeof marginMs === "number" ? marginMs : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Calculates if a project is new based on its creation date and the margin
 * @param createdAt - ISO date string (from Prisma extension)
 * @param newProjectMarginMs - The margin in milliseconds (optional)
 * @returns true if the project was created within the margin, false otherwise
 */
export const calculateIsNew = (
  createdAt: string,
  newProjectMarginMs?: number,
): boolean => {
  if (!newProjectMarginMs) return false;
  return new Date(createdAt).getTime() > Date.now() - newProjectMarginMs;
};
