"use client";

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { canModifyData, canViewData, isAdmin, isViewOnly } from "@/lib/permissions";

export function usePermissions() {
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role;

  return {
    canModify: canModifyData(userRole),
    canView: canViewData(userRole),
    isAdmin: isAdmin(userRole),
    isViewOnly: isViewOnly(userRole),
  };
}