import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: { companyId: string } }
) {
  try {
    const { companyId } = context.params;   // ✅ extract inside
    const { userId } = auth();              // ✅ no await

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    if (company.followers?.includes(userId)) {
      return new NextResponse("User already follows this company", { status: 400 });
    }

    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: { push: userId },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[COMPANY_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
