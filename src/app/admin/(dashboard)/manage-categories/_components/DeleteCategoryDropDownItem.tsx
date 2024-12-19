"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';

type DeleteCategoryDropDownItemProps = {
  id: string;
  disabled?: boolean;
  onSuccess?: () => void;
};

export function DeleteCategoryDropDownItem({ id, disabled = false, onSuccess }: DeleteCategoryDropDownItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this category? This action cannot be undone.');
    if (!confirmDeletion) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/categories/delete-category/${id}`, {
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

        if (onSuccess) {
          onSuccess();
        }

        router.refresh();
        alert(result.message);
        router.push('/admin/manage-categories');
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
      className="flex items-center gap-2 text-destructive focus:text-destructive"
    >
      <Trash className="h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}