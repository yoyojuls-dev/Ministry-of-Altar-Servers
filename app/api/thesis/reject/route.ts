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
  const { id, reason } = body;

  if (!id || !reason) {
    return NextResponse.json(
      { error: "Thesis ID and rejection reason are required" },
      { status: 400 }
    );
  }

  try {
    const thesis = await prisma.thesis.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        approvalDate: null,
        approvedBy: null
      }
    });

    return NextResponse.json({ 
      success: true, 
      thesis,
      message: "Thesis rejected"
    });
  } catch (error) {
    console.error("Error rejecting thesis:", error);
    return NextResponse.json(
      { error: "Failed to reject thesis" },
      { status: 500 }
    );
  }
}