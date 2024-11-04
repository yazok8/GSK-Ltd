// Also, updated .eslintrc.json to make disable this var error. 
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export {}; // This ensures the file is treated as a module
