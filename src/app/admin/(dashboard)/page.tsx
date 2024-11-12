import { CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSignIn from "../auth/sign-in/page";

export default async function page() {
  const session = await getServerSession(authOptions);

  // Fetch data concurrently
  return (
    <>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      {session ? <><h1 className="text-3xl ml-3"> Summary</h1></> : <AdminSignIn />}
    </>
  );
}
