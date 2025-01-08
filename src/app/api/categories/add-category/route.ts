import { addCategory } from "@/app/admin/actions/categories";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){

    return await addCategory(req);

}