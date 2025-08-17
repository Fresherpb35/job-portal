import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: { companyId: string } }
) {
  try {
    const { companyId } = context.params;

    // Clerk auth
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find company
    const company = await db.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Prevent duplicate follows
    if (company.followers?.includes(userId)) {
      return new NextResponse("User already follows this company", { status: 400 });
    }

    // Update followers (atomic push)
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: { followers: { push: userId } },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[ADD_FOLLOWER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
