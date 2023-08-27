// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GHProvider from "next-auth/providers/github";
// import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "#/env/server.mjs";
import { prisma } from "#/server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      Object.assign(session.user, user);
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma as any), // TODO: Remove `as any` when @next-auth/prisma-adapter fixes types
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    GHProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
