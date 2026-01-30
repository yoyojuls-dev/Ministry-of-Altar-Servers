import getCurrentStudent from "@/actions/getCurrentStudent";
import StudentLoginForm from "./StudentLoginForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Login - Thesis Archive Management System",
};

const StudentLoginPage = async () => {
  const currentStudent = await getCurrentStudent();

  if (currentStudent) {
    redirect("/");
  }

  return <StudentLoginForm />;
};

export default StudentLoginPage;