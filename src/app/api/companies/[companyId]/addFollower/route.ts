import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Record<string, string> }) {
  try {
    const { companyId } = params;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    // Validate MongoDB ObjectId
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(companyId)) {
      return new NextResponse("Invalid company ID", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Check for duplicate followers
    const followers = company.followers || [];
    if (followers.includes(userId)) {
      return new NextResponse("User already follows this company", { status: 400 });
    }

    // Update the followers
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: {
          push: userId,
        },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_PATCH] Error for companyId: ${params.companyId}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
