import { CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import AdminSignIn from '../auth/sign-in/page';

export default async function page() {


  // Fetch data concurrently
  return (
   <>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
    <AdminSignIn/>
    
    </>
  )
}
