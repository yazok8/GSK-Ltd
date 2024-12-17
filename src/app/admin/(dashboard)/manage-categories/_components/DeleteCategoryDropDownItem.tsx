// src/app/admin/_components/DeleteCategoryDropDownItem.tsx

"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';

type DeleteCategoryDropDownItemProps = {
  id: string;
  disabled?: boolean;
  onSuccess?: () => void;  // Add callback prop
};

export function DeleteCategoryDropDownItem({ id, disabled = false, onSuccess }: DeleteCategoryDropDownItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this category? This action cannot be undone.');
    if (!confirmDeletion) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/categories/delete-category/${id}`, { // Corrected URL
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(result.error);
          alert(result.error);
          return;
        }

        // Call onSuccess callback to trigger parent component refresh
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the router to update server-side props
      router.refresh();
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push('/admin/manage-categories');
      }, 1500);
        alert(result.message);
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      }
    });
  };

  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={handleDelete}
    >
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}
