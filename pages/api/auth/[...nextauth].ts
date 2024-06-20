import { NextApiHandler } from "next";
import NextAuth, { AuthOptions, Profile, Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: AuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: any;
      profile?: Profile;
    }) {
      if (account.provider === "email") {
        // Ensure user has a role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser && !dbUser.role) {
          throw new Error("User role is missing");
        }
      }
      return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      // Add role to session object
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
      });
      session.user.role = dbUser?.role;
      return session;
    },
  },
  pages: {
    // signIn: "/auth/signin", // Define custom sign-in page
    // verifyRequest: "/auth/verify-request", // Define verification request page
    // newUser: "/auth/new-user", // Define new user page
  },
};
