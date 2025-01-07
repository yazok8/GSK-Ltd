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
import { formatPrice } from "utils/formatPrice"; // Adjust import path as needed
import { ActiveToggleDropDownItem, DeleteDropDownItem } from "./ProductAction";

interface Product {
  id: string;
  name: string;
  price: number | null;         // handle null
  inStock: boolean | null;      // handle null
  category: { name: string } | null;
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
    <div className="table-container">
      <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
        Existing Products
      </h2>
      <table className="table bg-white">
        {/* Table Head (Desktop) */}
        <thead className="hidden md:table-header-group">
          <tr className='p-4'>
            <th className="w-0">
              <span className="sr-only">Available</span>
            </th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Head (Mobile) */}
        <thead className="md:hidden p-4">
          <tr>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {/* Desktop: In Stock / Out of Stock */}
              <TableCell className="hidden md:table-cell">
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

              {/* Mobile: Name */}
              <TableCell className="md:hidden">
                {product.name}
              </TableCell>
              {/* Desktop: Name */}
              <TableCell className="hidden md:table-cell">
                {product.name}
              </TableCell>

              {/* Desktop: Price */}
              <TableCell className="hidden md:table-cell">
                {formatPrice(product.price)}
              </TableCell>

              {/* Desktop: Category */}
              <TableCell className="hidden md:table-cell">
                {product.category?.name}
              </TableCell>

              {/* Mobile: Actions */}
              <TableCell className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem
                      onSelect={() => handleEditClick(product.id, product.name)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <ActiveToggleDropDownItem
                      id={product.id}
                      inStock={product.inStock ?? false}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropDownItem productId={product.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              {/* Desktop: Actions */}
              <TableCell className="hidden md:table-cell">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white">
                    <DropdownMenuItem
                      onSelect={() => handleEditClick(product.id, product.name)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <ActiveToggleDropDownItem
                      id={product.id}
                      inStock={product.inStock ?? false}
                    />
                    <DropdownMenuSeparator />
                    <DeleteDropDownItem productId={product.id} />
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
