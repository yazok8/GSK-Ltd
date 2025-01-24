// components/products/_components/CategorySidebar.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
}

interface CategorySidebarProps {
  categories: Category[];
  onCategoryChange: (selectedIds: string[]) => void;
  selectedCategories?: string[]; // Ensure this line exists
}

export default function CategorySidebar({
  categories,
  onCategoryChange,
  selectedCategories = [],
}: CategorySidebarProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCategories);

  useEffect(() => {
    setSelectedIds(selectedCategories);
  }, [selectedCategories]);

  const handleCheckbox = (categoryId: string) => {
    setSelectedIds((prev) => {
      let updated;
      if (prev.includes(categoryId)) {
        // Remove
        updated = prev.filter((id) => id !== categoryId);
      } else {
        // Add
        updated = [...prev, categoryId];
      }
      // Notify parent component of new selection
      onCategoryChange(updated);
      return updated;
    });
  };

  return (
    <nav className="h-full px-4 py-6 flex flex-col items-start text-left gap-6 bg-white">
      <div className="w-full border-b border-gray-800 text-start text-nowrap">
        Search By Category
      </div>

      <div className="flex flex-wrap justify-center md:flex-col w-full gap-4 space-y-5">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center space-x-2">
            <Checkbox
              id={cat.id}
              checked={selectedIds.includes(cat.id)}
              onCheckedChange={() => handleCheckbox(cat.id)}
              className='border-solid border-2 border-teal-200'
            />
            <label htmlFor={cat.id}>{cat.name}</label>
          </div>
        ))}
      </div>
    </nav>
  );
}
