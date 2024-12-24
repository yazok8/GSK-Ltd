import { Role } from "@prisma/client";

export function canModifyData(userRole: Role): boolean {
  return userRole === Role.ADMIN;
}

export function canViewData(userRole: Role): boolean {
  return userRole === Role.ADMIN || userRole === Role.VIEW_ONLY;
}

export function isAdmin(userRole: Role): boolean {
  return userRole === Role.ADMIN;
}

export function isViewOnly(userRole: Role): boolean {
  return userRole === Role.VIEW_ONLY;
}