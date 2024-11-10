import AdminNav from "./components/adminnav/AdminNav";

export const metadata = {
  title: "GSK Ltd website",
  description: "GSK Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AdminNav />
      <div className="container mt-20 mb-5">{children}</div>
    </>
  );
};

export default AdminLayout;
