import { useAdminNav } from "@/context/AdminNavContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import AdminNavItem from "../AdminNavItem";
import { MdEdit } from "react-icons/md";

export default function EditTab() {
  const pathname = usePathname();
  const { tabs, removeTab } = useAdminNav(); // Destructure removeTab from context

  return (
    <>
      {tabs.map((tab) => (
        <Link key={tab.path} href={tab.path}>
          <AdminNavItem
            label={tab.label}
            icon={MdEdit}
            selected={pathname === tab.path}
            onClose={() => removeTab(tab.path)} // Pass the onClose handler
          />
        </Link>
      ))}
    </>
  );
}
