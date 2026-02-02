// actions/getCurrentUser.ts - Fixed with proper Prisma import
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Create Prisma client instance
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    // Check if user is an admin first
    try {
      const adminUser = await prisma.adminUser.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          adminId: true,
          name: true,
          email: true,
          image: true,
          role: true,
          position: true,
          permissions: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (adminUser) {
        return {
          ...adminUser,
          userType: 'ADMIN' as const,
        };
      }
    } catch (adminError) {
      console.error("Error checking admin user:", adminError);
    }

    // Check if user is a member
    try {
      const member = await prisma.member.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
          memberId: true,
          name: true,
          email: true,
          image: true,
          role: true,
          memberStatus: true,
          serverLevel: true,
          dateJoined: true,
          birthdate: true,
          contactNumber: true,
          school: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (member) {
        return {
          ...member,
          userType: 'MEMBER' as const,
        };
      }
    } catch (memberError) {
      console.error("Error checking member:", memberError);
    }

    return null;
  } catch (error: any) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

// Helper function to check if user is admin
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true, isActive: true },
    });
    return adminUser?.isActive ?? false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Helper function to get user type
export async function getUserType(email: string): Promise<'ADMIN' | 'MEMBER' | null> {
  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });

    if (adminUser) return 'ADMIN';

    const member = await prisma.member.findUnique({
      where: { email },
      select: { id: true },
    });

    if (member) return 'MEMBER';

    return null;
  } catch (error) {
    console.error("Error getting user type:", error);
    return null;
  }
}