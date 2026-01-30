import { Metadata } from "next";
import AdminNavigation from "./AdminNavigation";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard - Thesis Archive Management System",
  description: "Admin panel for managing thesis documents and categories",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Only redirect if user exists but is not admin
  // This allows login/register pages to work
  if (currentUser && currentUser.role !== "ADMIN") {
    redirect("/student/dashboard");
  }

  // If user is authenticated as admin, show with navigation
  if (currentUser && currentUser.role === "ADMIN") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminNavigation currentUser={currentUser} />
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    );
  }

  // For non-authenticated users (login/register pages), show without navigation
  return <>{children}</>;
}