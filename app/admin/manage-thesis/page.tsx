import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import ManageThesisComponent from "./ManageThesisComponent";
import AdminLayout from "../AdminLayout";
import prisma from "@/libs/prismadb";

const ManageThesisPage = async () => {
  const currentUser = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories for filtering
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <AdminLayout 
      currentUser={currentUser}
      title="Manage Thesis"
      subtitle="View, edit, and organize thesis entries"
    >
      <ManageThesisComponent 
        currentUser={currentUser}
        categories={categories}
      />
    </AdminLayout>
  );
};

export default ManageThesisPage;