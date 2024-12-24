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

  // If user is not an admin, redirect to 403
  if (session.user.role !== "ADMIN" && session.user.role !== "VIEW_ONLY") {
    redirect("/403");
  }

  return (
    <>
    <AdminNavProvider>
      <AdminNav />
      <div className="container mt-20 mb-5">{children}</div>
      </AdminNavProvider>
    </>
  );
};

export default AdminLayout;
