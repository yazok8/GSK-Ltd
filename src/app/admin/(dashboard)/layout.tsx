import { AdminNavProvider } from "@/context/AdminNavContext";
import AdminNav from "../components/adminnav/AdminNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "GSK Ltd website",
  description: "GSK Admin Dashboard",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/admin/auth/sign-in");
  }

  // If user is not an admin (or VIEW_ONLY), redirect to 403
  if (session.user.role !== "ADMIN" && session.user.role !== "VIEW_ONLY") {
    redirect("/403");
  }

  return (
    <AdminNavProvider>
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-60 border-r">
          {/*
            Pass the session object to the Navbar as a prop.
            This means the Navbar will have the session data immediately,
            without a client-side loading step.
          */}
          <AdminNav session={session} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5">{children}</div>
      </div>
    </AdminNavProvider>
  );
};

export default AdminLayout;
