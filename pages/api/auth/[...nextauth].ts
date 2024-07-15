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
  secret: process.env.NEXTAUTH_SECRET,
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
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });
        if (dbUser && !dbUser.role) {
          throw new Error("User role is missing");
        }
      }
      return true;
    },
    async session({ session, token }: { session: Session; token: any }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
      });
      session.user = {
        ...session.user,
        role: dbUser?.role ?? undefined,
        id: dbUser?.id ?? undefined,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/check-email",
  },
};
