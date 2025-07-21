// File: /app/api/jobs/[jobId]/route.ts

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // your Prisma or DB import

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
const { jobId } = await params; 
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updatedValues = await req.json();

    const job = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
     data :updatedValues,
    });

    return Response.json(job);
  } catch (error) {
    console.error("[JOB_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
