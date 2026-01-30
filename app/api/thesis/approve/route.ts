import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/libs/prismadb";

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Thesis ID is required" },
      { status: 400 }
    );
  }

  try {
    const thesis = await prisma.thesis.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvalDate: new Date(),
        approvedBy: currentUser.id,
        rejectionReason: null
      }
    });

    return NextResponse.json({ 
      success: true, 
      thesis,
      message: "Thesis approved successfully"
    });
  } catch (error) {
    console.error("Error approving thesis:", error);
    return NextResponse.json(
      { error: "Failed to approve thesis" },
      { status: 500 }
    );
  }
}