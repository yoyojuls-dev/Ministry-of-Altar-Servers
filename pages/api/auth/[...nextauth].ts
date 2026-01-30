import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Try to find admin user first
        const adminUser = await prisma.adminUser.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (adminUser && adminUser.hashedPassword) {
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            adminUser.hashedPassword
          );

          if (isCorrectPassword) {
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: "ADMIN",
            };
          }
        }

        // If not admin, try student user
        const studentUser = await prisma.studentUser.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (studentUser && studentUser.hashedPassword) {
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            studentUser.hashedPassword
          );

          if (isCorrectPassword) {
            return {
              id: studentUser.id,
              email: studentUser.email,
              name: studentUser.name,
              role: "STUDENT",
            };
          }
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/student/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);