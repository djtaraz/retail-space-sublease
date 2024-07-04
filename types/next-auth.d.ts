import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string | null;
      id?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    id?: string | null;
  }
}
