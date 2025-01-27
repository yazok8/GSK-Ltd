// Import the NavigationProvider from the context
import { NavigationProvider } from "@/context/ClientNavigationContext";
// Import the ClientLayout component
import ClientLayout from "./ClientLayout";

/**
 * Layout component that wraps its children with NavigationProvider and ClientLayout.
 * This ensures that all nested components have access to the navigation context.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render within the layout
 * @returns {JSX.Element} The composed layout component
 */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Wrap children with NavigationProvider to provide navigation context */}
      <NavigationProvider>
        {/* Wrap with ClientLayout for consistent client-side layout structure */}
        <ClientLayout>
          {/* Render the nested child components */}
          <div>{children}</div>
        </ClientLayout>
      </NavigationProvider>
    </>
  );
}
