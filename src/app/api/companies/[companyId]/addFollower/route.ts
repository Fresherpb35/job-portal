import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: { companyId: string } } // ✅ keep full context
) {
  try {
    const { companyId } = context.params; // ✅ extract params here

    const { userId } = auth(); // ✅ no await
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("ID is missing", { status: 400 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return new NextResponse("Company not Found", { status: 404 });
    }

    // Update the data
    const updatedCompany = await db.company.update({
      where: { id: companyId },
      data: {
        followers: { push: userId }, // ✅ atomic push
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[company_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
