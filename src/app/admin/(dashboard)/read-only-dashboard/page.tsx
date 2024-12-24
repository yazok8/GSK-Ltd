// pages/admin/read-only-dashboard.js  

import { getServerSession } from "next-auth";  
import { authOptions } from "@/lib/auth";  
import prisma from '@/lib/prisma';  
import { getHomeCategories } from "@/lib/getCategories";  
import AdminSignIn from '../../auth/sign-in/page';
import ReadOnlyDashboard from "../../components/ReadOnlyDashboard";
  
export default async function ReadOnlyDashboardPage() {  
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
  
  return <ReadOnlyDashboard products={products} categories={categories} />;  
}
