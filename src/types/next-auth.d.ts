import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    username: string;
    role: Role;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}
