import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    // Access params directly (no await needed)
    const { jobId } = params;

    // Validate MongoDB ObjectId
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(jobId)) {
      return new NextResponse("Invalid job ID", { status: 400 });
    }

    // Await auth to get userId
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const updatedValues = await req.json();

    // Validate updatedValues (example: ensure required fields)
    const allowedFields = [
      "title",
      "description",
      "imageUrl",
      "categoryId",
      "isPublished",
      "companyId",
    ];
    const invalidFields = Object.keys(updatedValues).filter(
      (key) => !allowedFields.includes(key)
    );
    if (invalidFields.length > 0) {
      return new NextResponse(`Invalid fields: ${invalidFields.join(", ")}`, {
        status: 400,
      });
    }

    // Check if job exists
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId, // Ensure only the owner can update
      },
    });

    if (!job) {
      return new NextResponse("Job not found or unauthorized", {
        status: 404,
      });
    }

    // Update the job
    const updatedJob = await db.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: updatedValues,
    });

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("[JOB_UPDATE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
