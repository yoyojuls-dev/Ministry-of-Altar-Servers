import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📝 Received registration data:", body);
    
    const { 
      name, 
      email, 
      password, 
      studentId, 
      birthdate,
      college,
      department,
      course,
    } = body;

    // Validate input
    if (!name || !email || !password || !studentId) {
      console.log("❌ Missing required fields:", { name, email, password: !!password, studentId });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("✅ All required fields present");

    // Check if student already exists
    console.log("🔍 Checking if email exists:", email);
    const existingStudent = await prisma.studentUser.findUnique({
      where: { email },
    });

    if (existingStudent) {
      console.log("❌ Email already exists");
      return NextResponse.json(
        { error: "Student with this email already exists" },
        { status: 400 }
      );
    }

    console.log("✅ Email is available");

    // Check if studentId already exists
    if (studentId) {
      console.log("🔍 Checking if student ID exists:", studentId);
      const existingStudentId = await prisma.studentUser.findUnique({
        where: { studentId },
      });

      if (existingStudentId) {
        console.log("❌ Student ID already exists");
        return NextResponse.json(
          { error: "Student ID already exists" },
          { status: 400 }
        );
      }
      
      console.log("✅ Student ID is available");
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // Create student user
    console.log("💾 Creating student user in database...");
    const student = await prisma.studentUser.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "USER",
        studentId,
        birthdate: birthdate ? new Date(birthdate) : null,
        college: college || null,
        department: department || null,
        course: course || null,
      },
    });

    console.log("✅ Student created successfully:", student.id);

    // Remove sensitive data
    const { hashedPassword: _, ...studentWithoutPassword } = student;

    return NextResponse.json({
      success: true,
      user: studentWithoutPassword,
    });
  } catch (error: any) {
    console.error("💥 REGISTRATION ERROR:", error);
    console.error("Error message:", error.message);
    
    return NextResponse.json(
      { 
        error: "Failed to create student account",
        details: error.message
      },
      { status: 500 }
    );
  }
}