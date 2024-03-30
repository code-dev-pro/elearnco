import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { prisma, User } from "database";
import { redirect } from "next/navigation";
import {
  getServerSession as oGetServerSession,
  ISODateString,
  NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SafeUser } from "schemas/auth/Auth";
import { ERoutes } from "schemas/routes/enums";

import { providers } from "./providers";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: `/${ERoutes.SIGN}`,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    ...providers,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            author: true,
          },
        });

        if (!user) throw new Error("no user found");
        const _compare = await compare(credentials.password, user.password);
        if (_compare) {
          return user;
        } else {
          throw new Error("invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        const user = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            email: session?.user.email,
            image: session?.user.image,
            name: session?.user.name,
          },
        });

        const { password: _password, ...safeUser } = user;
        user && (token.user = safeUser);
        return token;
      }

      if (!user) return token;
      const { password: _password, ...safeUser } = user as User;
      user && (token.user = safeUser);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as SafeUser;
      return session;
    },
  },
};

type UserSession = {
  expires: ISODateString;
  user?: SafeUser;
};
export function getServerSession() {
  return oGetServerSession<typeof authOptions, UserSession>(authOptions);
}

export async function getServerUser() {
  const session = await getServerSession();
  const user = session?.user as SafeUser;

  if (!user) redirect(`/${ERoutes.WELCOME}`);
  return user;
}
