import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import CartProvider from "@/providers/CartProvider";
import { Toaster } from "react-hot-toast";
import getCurrentUser from "@/actions/getCurrentUser";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Ministry of Altar Servers Management System", 
  description: "Digital management system for altar server ministry activities, attendance tracking, member management, and mass scheduling",
};

async function getIsAdminRoute(pathname: string) {
  return pathname.startsWith('/admin');
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${poppins.className} text-slate-700`}>
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(59 130 246)",
              color: "#fff",
            },
          }}
        />
        <CartProvider>
          <div className="flex flex-col min-h-screen">            
            <main className="flex-grow">{children}</main>            
          </div>
        </CartProvider>
      </body>
    </html>
  );
}