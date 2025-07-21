import { UserProfile } from '@clerk/nextjs';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
) {
  try {
    const {userId } = await auth();
const values = await req.json()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
let profile = await db.userProfile.findUnique({
     where:{
        userId,
     }
});

let userProfile
if(profile){
  userProfile = await db.userProfile.update({

   where:{
        userId
    },
    data:{
        ...values
    }
  })
}else{
    userProfile = await db.userProfile.create({

        data:{
            userId,
            ...values,
        }
    })
}
  
    return Response.json(userProfile);
  } catch (error) {
    console.error("[JOB_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
