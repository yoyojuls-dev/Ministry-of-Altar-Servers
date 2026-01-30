import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import prisma from "@/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Try to find admin user first
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (adminUser) {
      return {
        ...adminUser,
        createdAt: adminUser.createdAt.toISOString(),
        updatedAt: adminUser.updatedAt.toISOString(),
        emailVerified: adminUser.emailVerified?.toISOString() || null,
        birthdate: adminUser.birthdate?.toISOString() || null,
      };
    }

    // If not admin, try student user
    const studentUser = await prisma.studentUser.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (studentUser) {
      return {
        ...studentUser,
        createdAt: studentUser.createdAt.toISOString(),
        updatedAt: studentUser.updatedAt.toISOString(),
        emailVerified: studentUser.emailVerified?.toISOString() || null,
        birthdate: studentUser.birthdate?.toISOString() || null,
      };
    }

    return null;
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}