"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import ProductsTable from "../(dashboard)/manage-products/components/ProductsTable";
import CategoriesTable from "../(dashboard)/manage-categories/_components/CategoriesTable";

type DashboardContentProps = {
  products: any[];
  categories: any[];
};

export default function DashboardContent({ products, categories }: DashboardContentProps) {
  const { isViewOnly } = usePermissions();

  return (
    <>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      {isViewOnly && (
        <div className="bg-blue-100 p-4 rounded-md mx-4 mb-4">
          <p className="text-blue-800">
            You are in view-only mode. You can explore the dashboard but cannot make changes.
          </p>
        </div>
      )}
      <h1 className="text-3xl ml-3">Summary</h1>
      <div className="mt-8">
        <div className="flex justify-end items-end">
          <Link href="/admin/manage-products" className="hover:underline">
            See all products
          </Link>
        </div>
        <ProductsTable products={products} />
      </div>
      <div className="mt-8">
        <div className="flex justify-end items-end">
          <Link href="/admin/manage-categories" className="hover:underline">
            See all categories
          </Link>
        </div>
        <CategoriesTable categories={categories} />
      </div>
    </>
  );
}