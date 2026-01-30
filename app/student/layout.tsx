import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard - Thesis Archive Management System",
  description: "Browse and download thesis documents",
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}