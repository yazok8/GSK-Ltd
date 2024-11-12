"use client";

import React, { useEffect, useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteCategoryDropDownItem } from "../manage-categories/_components/DeleteCategoryDropDownItem";
import AdminContainer from "@/components/ui/AdminContainer";
import CategoryForm from "./_components/CategoryForm";
import Image from "next/image";

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

  return (
    <>
      <AdminContainer />
      <div className="w-full mx-auto p-4">
        <CategoryForm />
        <div className="w-full">
          <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
            Existing Categories
          </h2>

          <table className="mx-auto min-w-[30rem]">
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
                      <div className="relative h-10 w-10">
                        <Image
                           src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`}
                          alt={category.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
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
