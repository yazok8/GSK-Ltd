import { AddProduct } from "@/app/admin/actions/products";
import { parseForm } from "../../../../../utils/formUtils";

export const runtime = 'nodejs';

export async function POST(req:Request){

  try{
    const { fields, files } = await parseForm(req);

    const response = await AddProduct(fields, files);
    return response
  
  }catch(err:unknown){
    console.error('Error in POST handler:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}