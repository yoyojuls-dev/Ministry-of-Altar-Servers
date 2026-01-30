"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

const NavBarWrapper = () => {
  const pathname = usePathname();
  
  // Hide navbar on admin pages (except login/register)
  const isAdminPage = pathname?.startsWith('/admin') && 
                      !pathname?.includes('/login') && 
                      !pathname?.includes('/register');
  
  // Hide navbar on student dashboard pages
  const isStudentDashboard = pathname?.startsWith('/student/dashboard');
  
  if (isAdminPage || isStudentDashboard) {
    return null;
  }
  
  return <NavBar />;
};

export default NavBarWrapper;