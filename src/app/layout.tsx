import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Layout from "./(customerFacing)/layout";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GSK Limited",
  description: "Foor export services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen flex flex-col bg-background font-sans antialiased", inter.variable)}
      >
        <Layout/>
        {children}
      </body>
    </html>
  );
}
