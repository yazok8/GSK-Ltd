"use client";

import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Edit, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { DeleteCategoryDropDownItem } from './DeleteCategoryDropDownItem';
import { useAdminNav } from '@/context/AdminNavContext';

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoriesTableProps {
  categories: Category[];
}

function CategoriesTable({ categories }: CategoriesTableProps) {
  const { addTab } = useAdminNav();

  const handleEditClick = (categoryId: string, categoryName: string) => {
    const editPath = `/admin/edit-category/${categoryId}`;
    addTab({ path: editPath, label: `Edit ${categoryName}` });
  };

  return (
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
          {categories?.map((category) => (
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
                      className="rounded object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
              <TableCell className="py-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-accent rounded-full">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
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

export default CategoriesTable;