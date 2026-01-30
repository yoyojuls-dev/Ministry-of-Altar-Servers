import { Metadata } from "next";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - Thesis Archive Management System",
  description: "Admin panel for managing thesis documents and categories",
};

const AdminPage = async () => {
  const currentUser = await getCurrentUser();

  // Redirect if not admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <AdminDashboard currentUser={currentUser} />;
};

export default AdminPage;