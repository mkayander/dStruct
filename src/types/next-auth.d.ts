import type { DefaultSession } from "next-auth";

import type { User as PrismaUser } from "#/server/db/generated/client";

declare module "next-auth" {
  // export interface User extends PrismaUser {}

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: PrismaUser & DefaultSession["user"];
  }

  type UserProps = PrismaUser;
}
