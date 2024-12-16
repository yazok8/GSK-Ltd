import { CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSignIn from "../auth/sign-in/page";
import prisma from '../../../lib/prisma';
import ProductsTable from "./manage-products/components/ProductsTable";
import CategoriesTable from "./manage-categories/_components/CategoriesTable";
import { getHomeCategories } from "@/lib/getCategories";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);

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

  const getCategories = await getHomeCategories();

  return (
    <>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      {session ? (
        <>
          <h1 className="text-3xl ml-3">Summary</h1>
          <div className="mt-8">
          <div className='flex justify-end items-end'>
            <Link href='/admin/manage-products' className="hover:underline">See all products</Link>
            </div>
            <ProductsTable products={products} />
          </div>
          <div className="mt-8">
            <div className='flex justify-end items-end'>
            <Link href='/admin/manage-categories' className="hover:underline">See all categories</Link>
            </div>

            <CategoriesTable categories={getCategories} />
          </div>
        </>
      ) : (
        <AdminSignIn />
      )}
    </>
  );
}
