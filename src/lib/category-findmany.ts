
import prisma from '@/lib/prisma';


export async function fetchCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }