import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      userType: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    userType?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    userType: string;
    id: string;
  }
}