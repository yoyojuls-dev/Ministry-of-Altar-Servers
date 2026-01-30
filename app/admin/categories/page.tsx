import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AdminLayout from "../AdminLayout";
import ManageCategoriesClient from "./ManageCategoriesClient";
import prisma from "@/libs/prismadb";

const CategoriesPage = async () => {
  const currentUser = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all categories
  const categoriesData = await prisma.category.findMany({
    include: {
      _count: {
        select: { thesis: true }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  // Serialize dates and add thesis count
  const categories = categoriesData.map((category) => ({
    ...category,
    thesisCount: category._count.thesis,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));

  return (
    <AdminLayout 
      currentUser={currentUser}
      title="Manage Categories"
      subtitle="Organize thesis documents by academic program"
    >
      <ManageCategoriesClient categories={categories} />
    </AdminLayout>
  );
};

export default CategoriesPage;