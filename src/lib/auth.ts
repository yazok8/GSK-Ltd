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
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("MissingCredentials");
        }

        const { identifier, password } = credentials;

        try {
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
          console.log("User role from DB:", user.role); 
          if (!user.hashedPassword) {
            throw new Error("NoPasswordSet");
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) {
            throw new Error("InvalidPassword");
          }

          // Allow both ADMIN and VIEW_ONLY roles to access the dashboard
          if (user.role !== Role.ADMIN && user.role !== Role.VIEW_ONLY) {
            throw new Error("InsufficientPermissions");
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
          throw error;
        }
      },
    }),
  ],
  callbacks: {  
    async jwt({ token, user }) {  
     if (user) {  
      console.log("[jwt callback] user.role:", user.role);
      token.id = user.id;  
      token.role = user.role; // Add this line to include the user's role in the token's payload  
      token.username = user.username;  
      token.name = user.name;  
      token.email = user.email;  
     }  
     console.log("[jwt callback] token.role:", token.role);
     return token;  
    },  
    async session({ session, token }) {  
     if (token && session.user) {  
      session.user = {  
        id: token.id as string,  
        username: token.username as string,  
        name: token.name as string,  
        email: token.email as string,  
        role: token.role as Role, // Add this line to include the user's role in the session  
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