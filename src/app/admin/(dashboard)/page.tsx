import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { getHomeCategories } from "@/lib/getCategories";
import AdminSignIn from "../auth/sign-in/page";
import DashboardContent from "../components/DashboardContent";


export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AdminSignIn />;
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      inStock: true,
      category: { select: { name: true } },
    },
    orderBy: { name: "asc" },
    take: 5,
  });

  const categories = await getHomeCategories();

  return <DashboardContent products={products} categories={categories} />;
}