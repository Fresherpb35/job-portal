import { Company } from './../../../../generated/prisma/index.d';
// File: /app/api/jobs/[jobId]/route.ts

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // your Prisma or DB import

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
const { companyId } = await params; 
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updatedValues = await req.json();

    const company = await db.company.update({
      where: {
        id: companyId,
        userId,
      },
     data :updatedValues,
    });

    return Response.json(company);
  } catch (error) {
    console.error("[companyId_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
