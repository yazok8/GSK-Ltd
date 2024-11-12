// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Load environment variables from .env file

const prisma = new PrismaClient();

async function main() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 1. Seed Admin User (Production Only)
  if (isDevelopment) {
    const adminEmail = 'ykherfan@ecom.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(`${adminPassword}`, 10);
      await prisma.user.create({
        data: {
          name: 'Yazan Kherfan',
          email: adminEmail,
          hashedPassword,
          role: 'ADMIN', // Corrected to match Role enum
        },
      });
      console.log('✅ Admin user created successfully.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  }

}

main()
  .catch((e) => {
    console.error('❌ Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
