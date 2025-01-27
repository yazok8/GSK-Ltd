import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

const secret = process.env.NEXTAUTH_SECRET;

const protectedAdminPaths = ["/admin"];
const writeProtectedPaths = [
  "/admin/create",
  "/admin/edit",
  "/admin/delete",
  "/api/admin/create",
  "/api/admin/edit",
  "/api/admin/delete",
];

const excludedPaths = [
  "/user/profile",
  "/admin/signin",
  "/admin/signup",
  "/admin/auth/signup",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/[...nextauth]",
  "/api/auth/callback/credentials",
  "/admin/read-only-dashboard",
  "/403",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedAdminPath = protectedAdminPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isWriteProtectedPath = writeProtectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isExcludedPath = excludedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedAdminPath && !isExcludedPath) {
    const token = await getToken({ req, secret });

    if (!token) {
      const signInUrl = new URL("/admin/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    if (token.role !== "ADMIN" && token.role !== "VIEW_ONLY") {
      return NextResponse.redirect(new URL("/403", req.url));
    }

    if (token.role === "VIEW_ONLY" && isWriteProtectedPath) {
      return NextResponse.redirect(new URL("/admin/read-only-dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};