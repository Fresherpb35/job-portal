import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  companyId: string;
}

export async function PATCH(
  req: Request,
  context: { params: Params } // use context, not destructured in type
) {
  try {
    const { companyId } = context.params;

    // Validate MongoDB ObjectId
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(companyId)) {
      return new NextResponse("Invalid company ID", { status: 400 });
    }

    // Get userId
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the company
    const company = await db.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const followers = company.followers || [];
    if (followers.includes(userId)) {
      return new NextResponse("User already follows this company", { status: 400 });
    }

    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: { followers: [...followers, userId] },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[ADD_FOLLOWER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
