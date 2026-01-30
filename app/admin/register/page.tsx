import getCurrentAdmin from "@/actions/getCurrentAdmin";
import AdminRegisterForm from "./AdminRegisterForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Registration - Thesis Archive Management System",
};

const AdminRegisterPage = async () => {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin) {
    redirect("/admin");
  }

  return <AdminRegisterForm />;
};

export default AdminRegisterPage;