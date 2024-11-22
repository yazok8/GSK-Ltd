
import ClientLayout from "./ClientLayout";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientLayout>
        <div>      {children}</div>

      </ClientLayout>
    </>
  );
}
