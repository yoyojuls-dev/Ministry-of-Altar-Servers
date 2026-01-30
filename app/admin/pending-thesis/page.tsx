import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import PendingApprovalsClient from "./PendingApprovalsClient";
import getPendingTheses from "@/actions/getPendingTheses";
import AdminLayout from "@/app/admin/AdminLayout";

const PendingThesisPage = async () => {
  const currentUser = await getCurrentUser();

  // Check if user is admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const pendingTheses = await getPendingTheses();

  return (
    <AdminLayout 
      currentUser={currentUser}
      title="Pending Approvals"
      subtitle="Review and approve thesis submissions"
    >
      <PendingApprovalsClient theses={pendingTheses} />
    </AdminLayout>
  );
};

export default PendingThesisPage;