import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import AddThesisForm from "./AddThesisForm";
import AdminLayout from "../AdminLayout";
import prisma from "@/libs/prismadb";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

const AddThesisPage = async () => {
  const currentUser = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await getCategories();

  // If no categories exist, show message to create categories first
  if (categories.length === 0) {
    return (
      <AdminLayout 
        currentUser={currentUser}
        title="Add New Thesis"
        subtitle="Set up categories before adding thesis"
      >
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create thesis categories before adding thesis. Categories help organize thesis by department or field of study.
            </p>
            <div className="space-y-3">
              <a
                href="/admin/categories"
                className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Manage Categories
              </a>
              <a
                href="/admin"
                className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      currentUser={currentUser}
      title="Add New Thesis"
      subtitle="Add a new thesis to the archive system"
    >
      <AddThesisForm categories={categories} />
    </AdminLayout>
  );
};

export default AddThesisPage;