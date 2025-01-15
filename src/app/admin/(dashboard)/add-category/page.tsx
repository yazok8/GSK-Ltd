import React from "react";
import CategoryForm from "../manage-categories/_components/CategoryForm";
import CategoriesTable from "../manage-categories/_components/CategoriesTable";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // 1) If user is not logged in or is VIEW_ONLY, block access
  if (!session || session.user?.role === "VIEW_ONLY") {
    return (
      <p className="text-center mt-10">
        You do not have permission to add or edit products.
      </p>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <CategoryForm />
      <CategoriesTable categories={categories} />
    </div>
  );
}
