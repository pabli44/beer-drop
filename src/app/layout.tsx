import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Beer Drop - Cerveza Artesanal",
  description: "Pide tu cerveza artesanal favorita por litros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
