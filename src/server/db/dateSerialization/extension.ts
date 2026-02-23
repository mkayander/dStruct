import { Prisma } from "@prisma/client/extension";

const dateField = <K extends "createdAt" | "updatedAt">(field: K) => ({
  needs: { [field]: true } as { [P in K]: true },
  compute(obj: Record<K, Date>) {
    const value = obj[field];
    return value instanceof Date ? value.toISOString() : value;
  },
});

/**
 * Result extension that converts createdAt and updatedAt to ISO strings.
 * Prisma infers the updated types (string instead of Date).
 * Generated from schema by prisma/scripts/generate-date-serialization.ts
 */
export function createDateSerializationExtension() {
  return Prisma.defineExtension({
    name: "date-serialization",
    result: {
      problem: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      account: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      session: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      user: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      verificationToken: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      leetCodeUser: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      playgroundProject: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      playgroundSolution: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },

      playgroundTestCase: {
        createdAt: dateField("createdAt"),
        updatedAt: dateField("updatedAt"),
      },
    },
  });
}
