"use client";

import React from "react";
import { useAdminNav } from "@/context/AdminNavContext";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CheckCircle2, Edit, MoreVertical, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "utils/formatPrice"; // Adjusted import path
import { ActiveToggleDropDownItem, DeleteDropDownItem } from "./ProductAction";

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  category?: { name: string } | null;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) { 
  const { addTab } = useAdminNav();

  const handleEditClick = (productId: string, productName: string) => {
    const editPath = `/admin/edit-product/${productId}`;
    addTab({ path: editPath, label: `Edit ${productName}` });
  };



  if (products.length === 0) return <p>No Products Found</p>;

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 mx-auto text-center">
      <thead>
        <tr>
          <th className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-0">
            <span className="sr-only">Available for purchase</span>
          </th>
          <th className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
            Name
          </th>
          <th className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
            Price
          </th>
          <th className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
            Category
          </th>
          <th className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.inStock ? (
                <>
                  <CheckCircle2 />
                  <span className="sr-only">In Stock</span>
                </>
              ) : (
                <>
                  <XCircle className="stroke-destructive" />
                  <span className="sr-only">Out of Stock</span>
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatPrice(product.price)}</TableCell>
            <TableCell>{product.category?.name}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-white'>
                  <DropdownMenuItem
                    onSelect={() => handleEditClick(product.id, product.name)}
                  >
                  <Edit className="mr-2 h-4 w-4"/>  Edit
                  </DropdownMenuItem>
                  <ActiveToggleDropDownItem
                    id={product.id}
                    inStock={product.inStock}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropDownItem productId={product.id}/>
                  {/* Other menu items */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </table>
  );
}
