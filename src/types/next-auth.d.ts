// types/next-auth.d.ts

import { Role } from "@prisma/client"; // Adjust the import path as necessary

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
  }

  interface Session {
    user: User;
  }
}
