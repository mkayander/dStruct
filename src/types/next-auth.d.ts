import NextAuth, { DefaultSession } from 'next-auth';
import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
    // export interface User extends PrismaUser {}

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: PrismaUser & DefaultSession['user'];
    }

    type UserProps = PrismaUser;
}
