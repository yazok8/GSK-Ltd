"use client";

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';

type DeletePartnerDropDownItemProps = {
  id: string;
  disabled?: boolean;
  onSuccess?: () => void;
  session?: any; // Replace 'any' if you have a custom Session type
};

export function DeletePartnerDropDownItem({
  id,
  disabled = false,
  onSuccess,
  session,
}: DeletePartnerDropDownItemProps) {
  const router = useRouter();

  // Check if user is VIEW_ONLY
  const isViewOnly = session?.user?.role === "VIEW_ONLY";

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // First, prevent a VIEW_ONLY user from triggering the delete
    if (isViewOnly) {
      alert("You do not have permission to delete partners.");
      return;
    }

    const confirmDeletion = window.confirm(
      'Are you sure you want to delete this partner? This action cannot be undone.'
    );
    if (!confirmDeletion) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/partners/deletePartner/${id}`, {
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
        router.push('/admin/manage-partners');
      } catch (error) {
        console.error('Failed to delete partner:', error);
        alert('Failed to delete partner. Please try again.');
      }
    });
  };

  return (
    <DropdownMenuItem
      // Disable the menu item if user is view-only or pending
      disabled={disabled || isViewOnly || isPending}
      onClick={handleDelete}
      className="flex items-center gap-2 text-destructive focus:text-destructive"
    >
      <Trash className="h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}
