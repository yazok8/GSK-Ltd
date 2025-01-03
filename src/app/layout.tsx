//src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Providers } from "./Provider";
import Footer from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GSK Limited",
  description: "Food export services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          {/* Wrap the main content in a flex-grow container */}
          <main className="flex-grow w-full overflow-x-hidden">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
