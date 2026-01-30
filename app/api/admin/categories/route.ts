import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import ManageCategoriesClient from "./ManageCategoriesClient";
import prisma from "@/libs/prismadb";

const ManageCategories = async () => {
  const currentUser = await getCurrentUser();

  // Check if user is admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all categories
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          thesis: true,
        },
      },
    },
  });

  return (
    <div className="p-8">
      <ManageCategoriesClient categories={categories} />
    </div>
  );
};

export default ManageCategories;