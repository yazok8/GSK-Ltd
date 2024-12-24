import { NextResponse, NextRequest } from 'next/server';  
import { getToken } from 'next-auth/jwt';  
import { Role } from '@prisma/client'  
  
const secret = process.env.NEXTAUTH_SECRET;  
  
const protectedAdminPaths = ['/admin'];  
const writeProtectedPaths = [  
  '/admin/create',  
  '/admin/edit',  
  '/admin/delete',  
  '/api/admin/create',  
  '/api/admin/edit',  
  '/api/admin/delete',  
];  
  
const excludedPaths = [  
  '/user/profile',  
  '/admin/signin',  
  '/admin/signup',  
  '/admin/auth/signup',  
  '/api/auth/signin',  
  '/api/auth/signup',  
  '/api/auth/[...nextauth]',  
  '/api/auth/callback/credentials',  
  '/admin/read-only-dashboard',  
  '/403',  
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
   
  if (isProtectedAdminPath) {   
  if (isExcludedPath) {   
   return NextResponse.next();   
  }   
   
  const token = await getToken({ req, secret });   

  console.log("[middleware] token:", token);
   
  if (!token) {   
   console.warn(`Unauthorized access attempt to ${pathname}`);   
   const signInUrl = new URL('/admin/signin', req.url);   
   signInUrl.searchParams.set('callbackUrl', req.url);   
   return NextResponse.redirect(signInUrl);   
  }   

  console.log("token.role =>", token.role);
   
  // Check if user has either ADMIN or VIEW_ONLY role   
  if (token.role !== 'ADMIN' && token.role !== 'VIEW_ONLY') {  
    console.warn(`Forbidden access attempt to ${pathname} by user ID: ${token.id}`);  
    return NextResponse.redirect(new URL('/403', req.url));  
  }

  // Allow VIEW_ONLY users to access read-only paths   
  if (token.role === 'VIEW_ONLY' && !isWriteProtectedPath) {  
  return NextResponse.next();  
}  
   
  // Only block write operations for VIEW_ONLY users   
  if (isWriteProtectedPath && token.role === 'VIEW_ONLY') {  
    console.warn(`Write operation attempted by VIEW_ONLY user ID: ${token.id}`);  
    return NextResponse.redirect(new URL('/admin/read-only-dashboard', req.url));  
  } else if (isWriteProtectedPath && token.role === 'ADMIN') {  
    return NextResponse.next();  
  }   
   
  // Allow VIEW_ONLY users to access the read-only dashboard   
  if (pathname === '/admin/read-only-dashboard' && token.role === 'VIEW_ONLY') {  
    return NextResponse.next();  
  }
   
  console.log(`Authorized access to ${pathname} by user ID: ${token.id}`);   
  }   
   
  return NextResponse.next();   
}  
  
export const config = {  
  matcher: ['/admin/:path*'],  
};
