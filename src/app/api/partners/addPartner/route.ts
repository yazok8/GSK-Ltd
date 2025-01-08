import { addPartner } from "@/app/admin/actions/partners";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    return addPartner(req)
}