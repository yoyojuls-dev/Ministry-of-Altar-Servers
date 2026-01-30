import { Metadata } from "next";
import getCurrentUser from "@/actions/getCurrentUser";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login - Thesis Archive Management System",
};

const AdminLogin = async () => {
  const currentUser = await getCurrentUser();
  
  return (
    <div className="min-h-screen">
      <AdminLoginForm currentUser={currentUser} />
    </div>
  );
};

export default AdminLogin;