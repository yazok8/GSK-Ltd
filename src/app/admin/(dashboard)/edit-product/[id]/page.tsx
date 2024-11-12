import prisma from '@/lib/prisma';
import AdminContainer from "@/components/ui/AdminContainer";
import ProductForm from '@/app/admin/components/ProductForm';


export default async function EditProductPage({params:{id}}:{params:{id:string}}){
    const product = await prisma.product.findUnique({where:{id}})
    
    return (
        <>
        <AdminContainer/>
        <ProductForm product={product}/>
        </>
    )
}