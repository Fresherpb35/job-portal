import { AppliedJob } from './../../../../../generated/prisma/index.d';
import { UserProfile } from '@clerk/nextjs';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
) {
  try {
    const {userId } = await auth();
const jobId = await req.text()


    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if(!jobId){
return new Response("Job Id Is Missing", { status: 401 });

    }
let profile = await db.userProfile.findUnique({
     where:{
        userId
     }
});
if(!profile){
    return new NextResponse("user Profile not found",{status:401})
}

    const updatedProfile = await db.userProfile.update({
          where:{
            userId
          },
          data:{
            appliedJobs:{
                push:{jobId}
            }
          }

})



    return Response.json(updatedProfile);
  } catch (error) {
    console.error("[JOB_APPLIED_JOBS_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
