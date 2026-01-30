import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📝 Received admin registration data:", body);
    
    const { 
      name, 
      email, 
      password, 
      adminId,
      birthdate,
      college,
      department,
      position 
    } = body;

    // Validate input
    if (!name || !email || !password || !adminId) {
      console.log("❌ Missing required fields:", { name, email, password: !!password, adminId });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("✅ All required fields present");

    // Check if admin already exists
    console.log("🔍 Checking if email exists:", email);
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Email already exists");
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    console.log("✅ Email is available");

    // Check if adminId already exists
    if (adminId) {
      console.log("🔍 Checking if admin ID exists:", adminId);
      const existingAdminId = await prisma.adminUser.findUnique({
        where: { adminId },
      });

      if (existingAdminId) {
        console.log("❌ Admin ID already exists");
        return NextResponse.json(
          { error: "Admin ID already exists" },
          { status: 400 }
        );
      }
      
      console.log("✅ Admin ID is available");
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed");

    // Create admin user (without course field)
    console.log("💾 Creating admin user in database...");
    const admin = await prisma.adminUser.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "ADMIN",
        adminId,
        birthdate: birthdate ? new Date(birthdate) : null,
        college: college || null,
        department: department || null,
        position: position || "Admin Officer",
        permissions: ["manage_thesis", "manage_categories"],
      },
    });

    console.log("✅ Admin created successfully:", admin.id);

    // Remove sensitive data
    const { hashedPassword: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      user: adminWithoutPassword,
    });
  } catch (error: any) {
    console.error("💥 ADMIN REGISTRATION ERROR:", error);
    console.error("Error message:", error.message);
    
    return NextResponse.json(
      { 
        error: "Failed to create admin account",
        details: error.message
      },
      { status: 500 }
    );
  }
}