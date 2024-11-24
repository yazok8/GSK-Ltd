//src/app/admin/(dashboard)/manage-categories/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Edit, MoreVertical } from "lucide-react";
import { DeleteCategoryDropDownItem } from "../manage-categories/_components/DeleteCategoryDropDownItem";
import AdminContainer from "@/components/ui/AdminContainer";
import CategoryForm from "./_components/CategoryForm";
import Image from "next/image";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAdminNav } from "@/context/AdminNavContext";

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const { addTab } = useAdminNav();

  const handleEditClick = (categoryId: string, categoryName: string) => {
    const editPath = `/admin/edit-category/${categoryId}`;
    addTab({ path: editPath, label: `Edit ${categoryName}` });
    // Optionally navigate to the edit page immediately
    // router.push(editPath);
  };

  return (
    <>
      <AdminContainer />
      <div className="w-full mx-auto p-4">
        <CategoryForm />
        <div className="w-full">
          <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
            Existing Categories
          </h2>

          <table className="mx-auto min-w-[40rem]">
            <thead className="border-none">
              <tr>
                <th
                  scope="col"
                  className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 p-4"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 p-4"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 p-4"
                >
                  Action
                </th>
              </tr>
            </thead>

            <TableBody>
              {categories.map((category) => (
                <TableRow className="border-b-0" key={category.id}>
                  <TableCell className="py-1">{category.name}</TableCell>
                  <TableCell className="py-1">
                    {category.image ? (
                   <div className="relative h-20 w-20">
                   <Image
                     src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`}
                     alt={category.name}
                     width={80}
                     height={80}
                     className="rounded"
                     style={{ objectFit: 'cover' }}
                   />
                 </div>
                    ) : (
                      <span>No Image</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="pt-0 pl-[10.5rem]">
                        <DropdownMenuItem
                          onSelect={() =>
                            handleEditClick(category.id, category.name)
                          }
                        >

                        <Edit className="mr-2 h-4 w-4"/>  Edit
                        </DropdownMenuItem>
                        {/* Include other actions like Edit if needed */}
                        <DeleteCategoryDropDownItem id={category.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      </div>
    </>
  );
}
