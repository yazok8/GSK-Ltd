// src/types/global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Augment the global scope with the prisma property
  namespace globalThis {
    var prisma: PrismaClient | undefined;
  }
}

export {};
