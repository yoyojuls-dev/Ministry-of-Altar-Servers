import { redirect } from "next/navigation";
import getCurrentUser from "@/actions/getCurrentUser";
import StudentDashboard from "./StudentDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Thesis Archive Management System",
  description: "Browse thesis documents and manage your favorites",
};

export default async function StudentDashboardPage() {
  const currentUser = await getCurrentUser();

  // If not logged in, redirect to student login
  if (!currentUser) {
    redirect("/student/login");
  }

  // If admin, redirect to admin dashboard
  if (currentUser.role === "ADMIN") {
    redirect("/admin");
  }

  return <StudentDashboard currentUser={currentUser} />;
}