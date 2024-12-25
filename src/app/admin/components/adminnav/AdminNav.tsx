"use client";

import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import { MdDashboard, MdDns, MdLibraryAdd } from "react-icons/md";
import { usePathname } from "next/navigation";
import EditTab from "./tabs/EditTabs";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth"; // For proper typing

interface AdminNavProps {
  session: Session; // or Session | null if you prefer
}

const AdminNav: React.FC<AdminNavProps> = ({ session }) => {
  const pathname = usePathname();

  return (
    <nav className="h-full px-4 py-6 flex flex-col items-start text-left gap-6">
      {/* Header / Logo */}
      <div className="w-full p-6 border-b border-gray-800 text-start flex items-start">
        <Link href="/admin">
          <span className="text-xl font-semibold">Admin Dashboard</span>
        </Link>
      </div>

      {/* Links Section */}
      <div className="flex flex-col w-full gap-4 space-y-5">
        {/* HomeTab */}
        <Link href="/admin">
        <AdminNavItem label="Summary" icon={MdDashboard} />
        </Link>

        {/* Admin Nav Items */}
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

        {/* Additional Tabs */}
        <EditTab />
      </div>

      {/* Sign Out Button */}
      {session && (
        <Button
          className="mt-auto bg-red-500 hover:bg-red-700 text-white font-bold w-full"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      )}
    </nav>
  );
};

export default AdminNav;
