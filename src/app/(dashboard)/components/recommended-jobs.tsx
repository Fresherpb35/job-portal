"use client"

import { Job } from "@/generated/prisma"
import Box from "./box"
import { PageContent } from "../(routes)/search/_components/page-content"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecommendedJobsProps{

    jobs: Job[],
    userId: string | null
}

const RecommendedJobsList = ({jobs,userId}:RecommendedJobsProps) => {
  return (
    <div className="flex-col justify-center gap-y-4 my-6 mt-12">
        <h2 className="text-2xl font-semibold tracking-wider font-sans text-center">
            Recommended Jobs
        </h2>
      <div className="mt-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      <Link href={"/search"} className="my-8">
      <div className="w-full flex justify-center items-center mt-12">
      <Button className="w-44 h-12 rounded-xl border-purple-500 hover:bg-transparent hover:shadow-md text-purple-500 hover:text-purple-600 bg-transparent">View All Jobs</Button>
         </div>
      </Link>
    </div>
 
  )
}

export default RecommendedJobsList
