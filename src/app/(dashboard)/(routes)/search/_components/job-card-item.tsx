"use client"

import { Company, Job } from "@/generated/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {motion} from "framer-motion"
import { formatDistanceToNow } from "date-fns";
import Box from "@/app/(dashboard)/components/box";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BookmarkCheck, BriefcaseBusiness, Currency, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn, formattedString } from "@/lib/utils";
import Link from "next/link";
import {truncate} from "lodash"
interface JobCardItemProps{

    job:Job;
    userId : string |null;
}



const JobCardItem = ({job,userId}:JobCardItemProps) => {

const typeJob = job as Job & {
  company : Company | null
}
const company = typeJob.company


  const [isBookmarkLoading , setIsBookmarkLoading] = useState(false)
  const SavedUserIcon = BookmarkCheck;
  
  return (
    <motion.div layout className="w-full max-w-md">
<Card className="w-full h-full">
   <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">

{/* saved user */}
    <Box>
<p>{formatDistanceToNow(new Date(job.createdAt),{addSuffix:true})}</p>

{/* <Button variant={"ghost"} size={"icon"}>
  {isBookmarkLoading ?(<Loader2 className ="w-4 h-4 animate-spin"/>):(
  
  <SavedUserIcon className={cn("w-4 h-4")} />)}


</Button> */}


    </Box>
    {/* company details */}


   <Box className="flex flex-col items-start gap-y-1 w-full">
  <p className="text-stone-700 font-semibold text-base w-full truncate">
    {job.title}
  </p>

  {company?.name && (
    <Link
      href={`/companies/${company.id}`}
      className="text-xs text-purple-500 w-full truncate"
    >
      {company.name}
    </Link>
    
  )}
  
</Box>

{/* job details */}


  <Box>
    {job.shiftTiming &&(
      <div className="text-xs text-muted-foreground flex items-center">
        <BriefcaseBusiness className="w-3 h-3 mr-1"/>
        {formattedString(job.shiftTiming)}
      </div>
    )}


     {job.workMode&&(
      <div className="text-xs text-muted-foreground flex items-center">
        <BriefcaseBusiness className="w-3 h-3 mr-1"/>
        {formattedString(job.workMode)}
      </div>
    )}


     {job.hourlyRate&&(
      <div className="text-xs text-muted-foreground flex items-center">
        <Currency className="w-3 h-3 mr-1"/>
        {`${formattedString(job.hourlyRate)} $/hr`}
      </div>
    )}
 {job.yearsofExperience&&(
      <div className="text-xs text-muted-foreground flex items-center">
        <BriefcaseBusiness className="w-3 h-3 mr-1"/>
        {formattedString(job.yearsofExperience)}
      </div>
    )}

  </Box>
   
   {job.short_description && (

    <CardDescription className="text-xs">

      {truncate(job.short_description,{
        length: 180,
        omission: "...",
      })}
    </CardDescription>
   )}

  <Box className="flex flex-col gap-2 mt-auto w-full">
  <Button
    asChild
    className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
    variant="outline"
  >
    <Link href={`/search/${job.id}`}>Details</Link>
  </Button>

  {/* <Button
    className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
    variant="outline"
  >
    Save
  </Button> */}
</Box>

    </div>
</Card>
 
    </motion.div>
  )
}

export default JobCardItem
