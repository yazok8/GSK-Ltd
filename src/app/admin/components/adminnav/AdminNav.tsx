// src/app/admin/components/AdminNav.tsx

"use client";

import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import { MdDashboard, MdDns, MdLibraryAdd, MdEdit } from "react-icons/md";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import { useAdminNav } from "@/context/AdminNavContext";

const AdminNav = () => {
  const pathname = usePathname();
  const { tabs } = useAdminNav();

  return (
    <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
      <Container>
        <div className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto flex-nowrap">
          <Link href="/admin">
            <AdminNavItem
              label="Summary"
              icon={MdDashboard}
              selected={pathname === "/admin"}
            />
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
          {/* Render additional tabs from context */}
          {tabs.map((tab) => (
            <Link key={tab.path} href={tab.path}>
              <AdminNavItem
                label={tab.label}
                icon={MdEdit}
                selected={pathname === tab.path}
              />
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default AdminNav;
