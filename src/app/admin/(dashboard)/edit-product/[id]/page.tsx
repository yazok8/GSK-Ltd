import prisma from '@/lib/prisma';
import AdminContainer from "@/components/ui/AdminContainer";
import ProductForm from '@/app/admin/(dashboard)/add-products/components/ProductForm';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';


export default async function EditProductPage({params:{id}}:{params:{id:string}}){

      const session = await getServerSession(authOptions);
    
      if (!session || session.user?.role === "VIEW_ONLY") {
        return <p className="text-center mt-10">You do not have permission to add or edit products.</p>;
      }
    
    
    const product = await prisma.product.findUnique({where:{id}})
    
    return (
        <>
        <AdminContainer/>
        <ProductForm product={product}/>
        </>
    )
}