import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    // Access params directly (no await needed)
    const { companyId } = params;

    // Validate MongoDB ObjectId
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(companyId)) {
      return new NextResponse("Invalid company ID", { status: 400 });
    }

    // Await auth to get userId
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the company
    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Ensure userId is not already in followers
    const followers = company.followers || [];
    if (followers.includes(userId)) {
      return new NextResponse("User already follows this company", { status: 400 });
    }

    // Update the data
    const updateData = {
      followers: [...followers, userId], // Append userId to followers
    };

    // Update the company (removed userId from where clause)
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[ADD_FOLLOWER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
