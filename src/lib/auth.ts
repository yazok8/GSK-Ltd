import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 60 * 60, // 1 hour
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        isAdmin: { type: "hidden" },
      },
      // Inside your NextAuth configuration file

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("MissingCredentials");
        }

        const { identifier, password } = credentials;

        try {
          // Find user by email or username
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: identifier.toLowerCase() },
                { username: identifier },
              ],
            },
          });

          if (!user) {
            throw new Error("UserNotFound");
          }

          if (!user.hashedPassword) {
            throw new Error("NoPasswordSet");
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            throw new Error("InvalidPassword");
          }

          // Ensure the user has admin role
          if (user.role !== Role.ADMIN) {
            throw new Error("NotAdmin");
          }

          return {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Error in authorize function:", error);
          // Re-throw the error to be handled by NextAuth
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          id: token.id as string,
          username: token.username as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as Role,
        };
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
      },
    },
  },
  pages: {
    signIn: "/admin/auth/sign-in",
  },
  debug: !isProduction,
};
