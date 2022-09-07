import NextAuth from 'next-auth';
import { User as PrismaUser } from '.prisma/client';

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User;
    }

    type UserProps = PrismaUser;

    export interface User extends PrismaUser {}
}
