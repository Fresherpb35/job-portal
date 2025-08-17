

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db"; // your Prisma or DB import
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
const { companyId } = await params; 
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }


    if(!companyId){
        return new NextResponse("ID is missing",{status:401})
    }




    const company = await db.company.findUnique({
      where: {
        id: companyId,
      
      },
   
    });

    if(!company){
        return new NextResponse("Company not Found",{status:401});
    }
//  update the data
const updateData = {
    followers :company?.followers?{push:userId}:[userId]
}

        const updatedCompany = await db.company.update({
            where:{
                id:companyId,
                userId
            },
            data:updateData
        })


    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("[company_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
