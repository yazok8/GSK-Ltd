//src/app/admin/(dashboard)/manage-categories/page.tsx

import React, { useEffect, useState } from "react";
import AdminContainer from "@/components/ui/AdminContainer";
import CategoryForm from "./_components/CategoryForm";
import CategoriesTable from "./_components/CategoriesTable";import prisma from '@/lib/prisma';
export default async function ManageCategories() {

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <AdminContainer />
      <div className="w-full mx-auto p-4">
        <CategoryForm />
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}
