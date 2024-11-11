import { AdminNavProvider } from "@/context/AdminNavContext";
import AdminNav from "./components/adminnav/AdminNav";

export const metadata = {
  title: "GSK Ltd website",
  description: "GSK Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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
