import prisma from "@/libs/prismadb";

export default async function getPendingTheses() {
  try {
    const theses = await prisma.thesis.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        uploadedBy: true,
        category: true
      },
      orderBy: {
        submissionDate: 'desc'
      }
    });

    return theses;
  } catch (error: any) {
    console.error("Error fetching pending theses:", error);
    return [];
  }
}