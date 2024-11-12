import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; 
import prisma from "@/lib/prisma"; // Correct default import
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client"; // Ensure correct import

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
        email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) { // Updated signature
        try {
          if (!credentials) {
            console.log("Missing credentials");
            return null;
          }

          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            console.log("Missing email or password");
            return null;
          }

          const normalizedEmail = email.toLowerCase();

          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user) {
            console.log("Invalid credentials");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            console.log("Invalid credentials");
            return null;
          }

          return {
            id: user.id, // Non-undefined
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          NextResponse.error();
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
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
        secure: isProduction, // true in production, false otherwise
        sameSite: "lax",
        path: "/", // Must be '/'
      },
    },
  },
  pages: {
    signIn: "/admin/auth/sign-in",
  },
  debug: isProduction ? false : true, // Enable debug only in development
};
