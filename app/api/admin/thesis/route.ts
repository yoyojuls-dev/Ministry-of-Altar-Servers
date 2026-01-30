// app/api/admin/thesis/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/libs/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      abstract,
      authorName,
      authorEmail,
      studentId,
      advisorName,
      coAdvisorName,
      committeeMembers,
      department,
      program,
      university,
      degreeLevel,
      categoryId,
      keywords,
      language,
      submissionDate,
      defenseDate,
      status,
      // Chapter content
      chapter1,
      chapter2,
      chapter3,
      chapter4,
      chapter5,
      references,
      appendices,
    } = body;

    // Validate required fields
    if (!title || !abstract || !authorName || !advisorName || !department || !program || !categoryId || !submissionDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract publication year from submission date
    const publicationYear = new Date(submissionDate).getFullYear();

    // Create thesis in database
    const thesis = await prisma.thesis.create({
      data: {
        title,
        abstract,
        authorName,
        authorEmail: authorEmail || null,
        studentId: studentId || null,
        advisorName,
        coAdvisorName: coAdvisorName || null,
        committeeMembers: committeeMembers || [],
        department,
        program,
        university: university || "Technological University of the Philippines - Manila",
        degreeLevel: degreeLevel || "BACHELOR",
        categoryId,
        keywords: keywords || [],
        language: language || "English",
        submissionDate: new Date(submissionDate),
        defenseDate: defenseDate ? new Date(defenseDate) : null,
        publicationYear,
        status: status || "APPROVED",
        approvalDate: status === "APPROVED" ? new Date() : null,
        // Chapter content
        chapter1: chapter1 || null,
        chapter2: chapter2 || null,
        chapter3: chapter3 || null,
        chapter4: chapter4 || null,
        chapter5: chapter5 || null,
        referencesText: references || null,
        appendices: appendices || null,
        // Link to admin
        uploadedByUserId: currentUser.id,
        approvedByAdminId: status === "APPROVED" ? currentUser.id : null,
      },
      include: {
        category: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            adminId: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Thesis created successfully",
        thesis,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[THESIS_POST]", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const status = searchParams.get("status") || "ALL";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "ALL";
    const sort = searchParams.get("sort") || "recent";

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    // Status filter
    if (status && status !== "ALL") {
      where.status = status;
    }

    // Category filter
    if (category && category !== "ALL") {
      where.categoryId = category;
    }

    // Search filter - MongoDB compatible
    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
        { program: { contains: search, mode: "insensitive" } },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" }; // default
    
    switch (sort) {
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "title-asc":
        orderBy = { title: "asc" };
        break;
      case "title-desc":
        orderBy = { title: "desc" };
        break;
      case "downloads":
        orderBy = { downloadCount: "desc" };
        break;
      case "views":
        orderBy = { viewCount: "desc" };
        break;
      case "rating":
        orderBy = { averageRating: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Get thesis with pagination
    const [thesisList, total] = await Promise.all([
      prisma.thesis.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              code: true,
              color: true,
            },
          },
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              adminId: true,
            },
          },
          _count: {
            select: {
              downloads: true,
              favorites: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.thesis.count({ where }),
    ]);

    return NextResponse.json({
      thesis: thesisList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[THESIS_GET]", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Thesis ID is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const dataToUpdate: any = { ...updateData };
    
    // Handle date fields
    if (updateData.defenseDate) {
      dataToUpdate.defenseDate = new Date(updateData.defenseDate);
    }
    if (updateData.submissionDate) {
      dataToUpdate.submissionDate = new Date(updateData.submissionDate);
      dataToUpdate.publicationYear = new Date(updateData.submissionDate).getFullYear();
    }

    // Update approval date if status changes to APPROVED
    if (updateData.status === "APPROVED") {
      dataToUpdate.approvalDate = new Date();
      dataToUpdate.approvedByAdminId = currentUser.id;
    }

    dataToUpdate.updatedAt = new Date();

    // Update thesis
    const updatedThesis = await prisma.thesis.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Thesis updated successfully",
      thesis: updatedThesis,
    });
  } catch (error) {
    console.error("[THESIS_PUT]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Thesis ID is required" },
        { status: 400 }
      );
    }

    // Delete thesis
    await prisma.thesis.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Thesis deleted successfully",
    });
  } catch (error) {
    console.error("[THESIS_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}