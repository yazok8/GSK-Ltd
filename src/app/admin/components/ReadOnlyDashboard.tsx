// components/ReadOnlyDashboard.js  
import { CardHeader, CardTitle } from "@/components/ui/card";  
import ProductsTable from "../(dashboard)/manage-products/components/ProductsTable";  
import CategoriesTable from "../(dashboard)/manage-categories/_components/CategoriesTable";  
  
type ReadOnlyDashboardProps = {  
  products: any[];  
  categories: any[];  
};  
  
export default function ReadOnlyDashboard({ products, categories }: ReadOnlyDashboardProps) {  
  return (  
   <>  
    <CardHeader>  
      <CardTitle>Admin Dashboard (Read-only)</CardTitle>  
    </CardHeader>  
    <h1 className="text-3xl ml-3">Summary</h1>  
    <div className="mt-8">  
      <ProductsTable products={products} readonly={true} />  
    </div>  
    <div className="mt-8">  
      <CategoriesTable categories={categories} readonly={true} />  
    </div>  
   </>  
  );  
}
