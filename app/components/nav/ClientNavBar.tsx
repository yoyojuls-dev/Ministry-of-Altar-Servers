"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

const ClientNavBar = () => {
  const pathname = usePathname();
  
  // Hide navbar on ALL admin pages (including login/register)
  const isAdminRoute = pathname?.startsWith("/admin");
  
  // Hide navbar on student dashboard pages  
  const isStudentDashboard = pathname?.startsWith("/student/dashboard");
  
  if (isAdminRoute || isStudentDashboard) {
    return null;
  }
  
  return <NavBar />;
};

export default ClientNavBar;