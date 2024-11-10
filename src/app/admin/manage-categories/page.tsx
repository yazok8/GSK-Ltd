"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteCategoryDropDownItem } from "../manage-categories/_components/DeleteCategoryDropDownItem"
import AdminContainer from "@/components/ui/AdminContainer";

interface CategoryFormInputs {
  name: string;
}

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export default function ManageCategories() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInputs>({ resolver: zodResolver(categorySchema) });

  const [categories, setCategories] = useState<Category[]>([])


  const onSubmit = async( data:CategoryFormInputs)=>{
    try{
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if(!response.ok){
        const resData = await response.json(); 
        throw new Error(resData.error || "failed to add category")
      }
      const newCategory :Category = await response.json(); 
      setCategories([...categories,newCategory])
      reset(); 
    }catch(err:any){
      console.error(err); 
      alert(err.message)
    }
  }

  useEffect(()=>{
    const fetchCategories=async()=>{
      try{
        const response = await fetch("/api/categories"); 
        if(!response.ok){
          throw new Error("Failed to fetch categories")
        };
        const data : Category[] = await response.json(); 
        setCategories(data) 
      }catch(error){
        console.error(error); 
      }
    }
    fetchCategories();
  },[])


  return (
    <>
    <AdminContainer/>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-destructive">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </div>

      <div className="flex flex-col justify-center mx-auto">
        <h2 className="text-xl font-semibold mt-8 mb-4 text-center">Existing Categories</h2>

      <table className="mx-auto min-w-[25rem]">
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
              Action
            </th>
          </tr>
        </thead>

        <TableBody>
          {categories.map((category) => (
            <TableRow className="border-b-0" key={category.id}>
              <TableCell className="py-1">{category.name}</TableCell>
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
    </>
  );
}
