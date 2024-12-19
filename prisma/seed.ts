// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Only seed admin user in development
  if (isDevelopment) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate environment variables
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set.');
    }

    if (!adminUsername) {
      throw new Error('ADMIN_USERNAME environment variable is not set.');
    }

    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }

    // Log the admin details being used (optional, remove in production for security)
    console.log(`Seeding admin user with email: ${adminEmail} and username: ${adminUsername}`);

    // Check if a user with the given email or username already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminEmail.toLowerCase() },
          { username: adminUsername },
        ],
      },
    });

    if (!existingAdmin) {
      // Hash the admin password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create the admin user
      await prisma.user.create({
        data: {
          name: 'Yazan Kherfan', // Replace with desired admin name
          email: adminEmail.toLowerCase(),
          username: adminUsername,
          hashedPassword,
          role: 'ADMIN', // Ensure this matches your Prisma enum for Role
        },
      });

      console.log('✅ Admin user created successfully.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  } else {
    console.log('ℹ️ Not in development mode. Skipping admin user seeding.');
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
