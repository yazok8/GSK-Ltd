import { NavigationProvider } from "@/context/ClientNavigationContext";
import ClientLayout from "./ClientLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationProvider>
        <ClientLayout>
          <div> {children}</div>
        </ClientLayout>
      </NavigationProvider>
    </>
  );
}
