import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleProductAvailability } from "../_actions/UpdateAvailabilityAction"; 
import { ActivityIcon, Trash } from "lucide-react";



export function ActiveToggleDropDownItem({id, inStock}:{id:string, inStock: boolean}){
const [isPending, startTransition] = useTransition(); 
const router = useRouter(); 

return <DropdownMenuItem
disabled={isPending}
onClick={
    ()=>{
        startTransition(async ()=>{
            await toggleProductAvailability(id, !inStock)
            router.refresh()
        })
    }}>
       <ActivityIcon /> {inStock ? 'Deactivate':'Activate'}
    </DropdownMenuItem>
}

export function DeleteDropDownItem({ productId }: { productId: string }) {
    const router = useRouter();
  
    const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this product?')) return;
  
      try {
        const response = await fetch('/api/products/deleteProduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productId }),
        });
  
        if (response.ok) {
          // Refresh the page or update state
          router.refresh();
        } else {
          const data = await response.json();
          alert(data.error || 'An error occurred.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product.');
      }
    };
  
    return (
      <DropdownMenuItem onClick={handleDelete}>
       <Trash className="mr-2 h-4 w-4"/> Delete
      </DropdownMenuItem>
    );
  }