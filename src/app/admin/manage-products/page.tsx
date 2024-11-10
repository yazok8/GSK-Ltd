import React from 'react'
import { prisma } from '@/lib/prisma';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { formatPrice } from '../../../../utils/formatPrice';
import AdminContainer from '@/components/ui/AdminContainer';

export default async function ManageProducts() {
  const products = await prisma.product.findMany({
    select:{
      id:true, 
      name:true, 
      price:true, 
      inStock:true,
      category:true
    },
    orderBy:{name:"asc"}
  });

  if(products.length===0) return <p>No Products Found</p>
  return (
    <>
      <AdminContainer/>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 mx-auto text-center">
      <thead>
        <tr>
          <th
            scope="col"
            className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 w-0"
          >
            <span className="sr-only">Available for purchase</span>
          </th>
          <th
            scope="col"
            className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Price
          </th>
          <th
            scope="col"
            className="text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
            Category
          </th>
          <th
            scope="col"
            className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
          >
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
                  <span className="sr-only"></span>
                </>
              ) : (
                <>
                  <span className="sr-only"></span>
                  <XCircle className="stroke-destructive" />
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
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  {/* <ActiveToggleDropDownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropDownItem id={product.id} disabled={product._count.orderProducts > 0} /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </table>
    </>
  );
}
