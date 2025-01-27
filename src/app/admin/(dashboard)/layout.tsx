// AdminLayout.tsx
import { AdminNavProvider } from "@/context/AdminNavContext";
import AdminNav from "../components/adminnav/AdminNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import React, { Suspense } from 'react';
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AdminLayoutErrorBoundary } from "../components/error-boundary/AdminLayoutErrorBoundary";
import ClientSideRedirect from "../auth/components/auth/ClientSideRedirect";

export const metadata = {
  title: "GSK Ltd website",
  description: "GSK Admin Dashboard",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <ClientSideRedirect />;
  }

  return (
    <AdminLayoutErrorBoundary>
      <AdminNavProvider>
        <div className="flex min-h-screen">
          <Suspense fallback={<LoadingSpinner />}>
            <div className="max-w-66 border-r">
              <AdminNav session={session} />
            </div>
            <main className="flex-1 p-5">
              <Suspense fallback={<LoadingSpinner />}>
                {children}``
              </Suspense>
            </main>
          </Suspense>
        </div>
      </AdminNavProvider>
    </AdminLayoutErrorBoundary>
  );
};

export default AdminLayout;

export const dynamic = 'force-dynamic';