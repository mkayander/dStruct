import NextAuth from "next-auth";

import { authOptions } from "#/server/auth/authOptions";

export { authOptions };

export default NextAuth(authOptions);
