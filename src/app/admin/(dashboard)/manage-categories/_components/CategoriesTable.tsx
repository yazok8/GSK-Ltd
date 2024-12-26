"use client";

import React from "react";
import { useAdminNav } from "@/context/AdminNavContext";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Edit, MoreVertical } from "lucide-react";
import Image from "next/image";
import { DeleteCategoryDropDownItem } from "./DeleteCategoryDropDownItem";

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const { addTab } = useAdminNav();

  const handleEditClick = (categoryId: string, categoryName: string) => {
    const editPath = `/admin/edit-category/${categoryId}`;
    addTab({ path: editPath, label: `Edit ${categoryName}` });
  };

  return (
    <div className="table-container">
      <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
        Existing Categories
      </h2>

      <table className="table bg-white">
        {/* Desktop Table Head */}
        <thead className="hidden md:table-header-group">
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>
              Action
            </th>
          </tr>
        </thead>

        {/* Mobile Table Head */}
        <thead className="md:hidden">
          <tr>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id} className="border-b-0">
              {/* Mobile: Name */}
              <TableCell className="md:hidden">
                {category.name}
              </TableCell>
              {/* Desktop: Name */}
              <TableCell className="hidden md:table-cell">
                {category.name}
              </TableCell>

              {/* Desktop: Image */}
              <TableCell className="hidden md:table-cell">
                {category.image ? (
                  <div className="relative h-20 w-20">
                    <Image
                      src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="rounded object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>

              {/* Mobile: Actions */}
              <TableCell className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-accent rounded-full">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] bg-white">
                    <DropdownMenuItem
                      onClick={() => handleEditClick(category.id, category.name)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DeleteCategoryDropDownItem id={category.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              {/* Desktop: Actions */}
              <TableCell className="hidden md:table-cell">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-accent rounded-full">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px] bg-white">
                    <DropdownMenuItem
                      onClick={() => handleEditClick(category.id, category.name)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DeleteCategoryDropDownItem id={category.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
