// components/ReadOnlyDashboard.js  
import ProductsTable from "../(dashboard)/manage-products/components/ProductsTable";  
import CategoriesTable from "../(dashboard)/manage-categories/_components/CategoriesTable";  
  
type ReadOnlyDashboardProps = {  
  products: any[];  
  categories: any[];  
};  
  
export default function ReadOnlyDashboard({ products, categories }: ReadOnlyDashboardProps) {  
  return (  
   <>  
    <h1 className="text-3xl ml-3">Summary</h1>  
    <div className="mt-8">  
      <ProductsTable products={products}/>  
    </div>  
    <div className="mt-8">  
      <CategoriesTable categories={categories}/>  
    </div>  
   </>  
  );  
}
