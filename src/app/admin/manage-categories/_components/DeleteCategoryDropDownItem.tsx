
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { startTransition, useTransition } from "react";

type DeleteDropDownItemProps = {
  id: string;
  disabled?: boolean;
};

export function DeleteCategoryDropDownItem({
  id,
  disabled = false,
}: DeleteDropDownItemProps) {
  const [isPending, setIsPending] = useTransition();

  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );
    if (!confirmDelete) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/categories${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (!response.ok) {
          console.error(result.error);
          alert(result.error);
          return;
        }
        alert(result.message);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category. Please try again.");
      }
    });
  };
  return (
    <DropdownMenuItem
    variant='destructive'
    disabled={disabled || isPending}
    onclick={handleDelete}>

    </DropdownMenuItem>
  )
}
