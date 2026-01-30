import { AdminUser, StudentUser } from "@prisma/client";

// Safe user type that works with both Admin and Student users
export type SafeUser = (
  Omit<AdminUser, "createdAt" | "updatedAt" | "emailVerified" | "birthdate"> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    birthdate: string | null;
  }
) | (
  Omit<StudentUser, "createdAt" | "updatedAt" | "emailVerified" | "birthdate"> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    birthdate: string | null;
  }
);
