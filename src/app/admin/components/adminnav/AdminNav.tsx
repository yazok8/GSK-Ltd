"use client";

import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import { MdDashboard, MdDns, MdLibraryAdd } from "react-icons/md";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import EditTab from "./tabs/EditTabs"; 
import HomeTab from "./tabs/HomeTab";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";


const AdminNav = () => {  
  const pathname = usePathname();  
  const { data: session, status } = useSession();  
  
  if (status === "loading") {  
   return <div>Loading...</div>;  
  }  
  
  return (  
   <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">  
    <Container>  
      <div className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">  
       <Link href="/admin">  
        <HomeTab />  
       </Link>  
       <Link href="/admin/add-products">  
        <AdminNavItem  
          label="Add Products"  
          icon={MdLibraryAdd}  
          selected={pathname === "/admin/add-products"}  
        />  
       </Link>  
       <Link href="/admin/manage-products">  
        <AdminNavItem  
          label="Manage Products"  
          icon={MdDns}  
          selected={pathname === "/admin/manage-products"}  
        />  
       </Link>  
       <Link href="/admin/manage-categories">  
        <AdminNavItem  
          label="Manage Categories"  
          icon={MdDns}  
          selected={pathname === "/admin/manage-categories"}  
        />  
       </Link>  
       <Link href="/admin/add-category">  
        <AdminNavItem  
          label="Add Category"  
          icon={MdDns}  
          selected={pathname === "/admin/add-category"}  
        />  
       </Link>  
       {/* Render additional tabs from context */}  
       <EditTab />  
       {session && (  
        <Button  
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"  
          onClick={() => signOut()}  
        >  
          Sign Out  
        </Button>  
       )}  
      </div>  
    </Container>  
   </div>  
  );  
};


export default AdminNav;
