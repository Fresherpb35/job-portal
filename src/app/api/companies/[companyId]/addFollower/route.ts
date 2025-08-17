import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// Define the PATCH handler with proper Next.js types
export async function PATCH(req: NextRequest, { params }: { params: { companyId: string } }) {
  try {
    const { companyId } = params; // Direct destructuring, no await
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
          push: userId, // Prisma syntax for appending to array
        },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_PATCH] Error for companyId: ${params.companyId}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import Next.js types

// Define the params interface explicitly
interface RouteParams {
  params: {
    companyId: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { companyId } = params; // Correct: Direct destructuring, no await
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
          push: userId, // Prisma syntax for appending to array
        },
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error(`[COMPANY_PATCH] Error for companyId: ${params.companyId}`, error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
