import getCurrentStudent from "@/actions/getCurrentStudent";
import StudentRegisterForm from "./StudentRegisterForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Registration - Thesis Archive Management System",
};

const StudentRegisterPage = async () => {
  const currentStudent = await getCurrentStudent();

  if (currentStudent) {
    redirect("/");
  }

  return <StudentRegisterForm />;
};

export default StudentRegisterPage;