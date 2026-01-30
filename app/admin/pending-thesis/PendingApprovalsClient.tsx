"use client";

import { Thesis, User, Category } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdCancel,
  MdRemoveRedEye,
} from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";

interface PendingApprovalsClientProps {
  theses: ExtendedThesis[];
}

type ExtendedThesis = Thesis & {
  uploadedBy: User;
  category: Category;
};

const PendingApprovalsClient: React.FC<PendingApprovalsClientProps> = ({ theses }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  let rows: any = [];

  if (theses) {
    rows = theses.map((thesis) => {
      return {
        id: thesis.id,
        title: thesis.title,
        authorName: thesis.authorName,
        submittedBy: thesis.uploadedBy.name,
        program: thesis.program,
        category: thesis.category.name,
        degreeLevel: thesis.degreeLevel,
        submittedAt: moment(thesis.submissionDate).fromNow(),
        status: thesis.status,
      };
    });
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { 
      field: "title", 
      headerName: "Thesis Title", 
      width: 300,
      renderCell: (params) => {
        return (
          <div className="font-medium text-gray-900 line-clamp-2" title={params.row.title}>
            {params.row.title}
          </div>
        );
      },
    },
    { 
      field: "authorName", 
      headerName: "Author(s)", 
      width: 180,
      renderCell: (params) => {
        return (
          <div className="text-sm text-gray-700">
            {params.row.authorName}
          </div>
        );
      },
    },
    { 
      field: "submittedBy", 
      headerName: "Uploaded By", 
      width: 140 
    },
    { 
      field: "program", 
      headerName: "Program", 
      width: 200,
      renderCell: (params) => {
        return (
          <div className="text-xs text-gray-600">
            {params.row.program}
          </div>
        );
      },
    },
    { 
      field: "category", 
      headerName: "Category", 
      width: 120,
      renderCell: (params) => {
        return (
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
            {params.row.category}
          </div>
        );
      },
    },
    { 
      field: "degreeLevel", 
      headerName: "Level", 
      width: 100,
      renderCell: (params) => {
        const levelColors: Record<string, string> = {
          BACHELOR: "bg-green-100 text-green-800",
          MASTER: "bg-purple-100 text-purple-800",
          DOCTORATE: "bg-red-100 text-red-800",
          DIPLOMA: "bg-yellow-100 text-yellow-800"
        };
        
        return (
          <div className={`px-2 py-1 rounded text-xs font-semibold ${levelColors[params.row.degreeLevel] || 'bg-gray-100 text-gray-800'}`}>
            {params.row.degreeLevel}
          </div>
        );
      },
    },
    { field: "submittedAt", headerName: "Submitted", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <div>
            {params.row.status === "PENDING" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-yellow-100"
                color="text-yellow-700"
              />
            ) : params.row.status === "APPROVED" ? (
              <Status
                text="approved"
                icon={MdCheckCircle}
                bg="bg-green-100"
                color="text-green-700"
              />
            ) : params.row.status === "REJECTED" ? (
              <Status
                text="rejected"
                icon={MdCancel}
                bg="bg-red-100"
                color="text-red-700"
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex justify-between gap-2 w-full">
            <ActionBtn
              icon={MdRemoveRedEye}
              onClick={() => {
                router.push(`/admin/thesis/${params.row.id}`);
              }}
            />
            {params.row.status === "PENDING" && (
              <>
                <ActionBtn
                  icon={MdCheckCircle}
                  onClick={() => {
                    handleApprove(params.row.id);
                  }}
                />
                <ActionBtn
                  icon={MdCancel}
                  onClick={() => {
                    handleReject(params.row.id);
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handleApprove = useCallback(async (id: string) => {
    if (isLoading) return;
    
    const confirmed = window.confirm("Are you sure you want to approve this thesis?");
    if (!confirmed) return;
    
    setIsLoading(true);
    toast.loading("Approving thesis...");

    try {
      await axios.put("/api/thesis/approve", { id });
      
      toast.dismiss();
      toast.success("Thesis approved successfully!");
      router.refresh();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || "Failed to approve thesis");
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  const handleReject = useCallback(async (id: string) => {
    if (isLoading) return;
    
    const reason = prompt("Please provide a reason for rejection:");
    
    if (!reason || reason.trim() === "") {
      toast.error("Rejection reason is required");
      return;
    }

    setIsLoading(true);
    toast.loading("Rejecting thesis...");

    try {
      await axios.put("/api/thesis/reject", { id, reason });
      
      toast.dismiss();
      toast.success("Thesis rejected");
      router.refresh();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || "Failed to reject thesis");
    } finally {
      setIsLoading(false);
    }
  }, [router, isLoading]);

  const pendingCount = theses.filter(t => t.status === "PENDING").length;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Heading title="Pending Thesis Approvals" />
          <p className="text-gray-600 mt-2">Review and approve submitted theses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
            <span className="font-semibold text-lg">{pendingCount}</span>
            <span className="ml-2 text-sm">pending approval{pendingCount !== 1 && "s"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalsClient;