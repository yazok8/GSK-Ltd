import React from "react";
import AdminContainer from "@/components/ui/AdminContainer";
import CategoryForm from "./_components/CategoryForm";
import CategoriesTable from "./_components/CategoriesTable";import prisma from '@/lib/prisma';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export default async function ManageCategories() {



  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });



  return (
    <>
      <AdminContainer />
      <div className="w-full mx-auto p-4">
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
