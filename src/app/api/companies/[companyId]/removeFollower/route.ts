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

    // Check if userId is in followers
    const followers = company.followers || [];
    if (!followers.includes(userId)) {
      return new NextResponse("User not found in followers", { status: 404 });
    }

    // Update the company to remove the userId from followers
    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
        // Remove userId from where clause unless only the owner can modify followers
      },
      data: {
        followers: {
          set: followers.filter((followerId) => followerId !== userId),
        },
      },
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error("[REMOVE_FOLLOWER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
