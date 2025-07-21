"use client"

import Box from "@/app/(dashboard)/components/box"
import { ApplyModal } from "@/components/ui/apply-modal"
import { Banner } from "@/components/ui/banner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb"
import { Preview } from "@/components/ui/preview"
import { Company, Job, UserProfile } from "@/generated/prisma"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"


interface JobDetailsPageContentProps{
    job: Job & { company: Company | null },
    jobId: string,
    userProfile: UserProfile | null
}

export const JobDetailsPageContent  = ({job, jobId, userProfile}: JobDetailsPageContentProps) =>{

const[isLoading, setIsLoading] = useState(false)
const[open, setOpen] = useState(false)
 const router = useRouter()


const onApplied = async () =>{
  setIsLoading(true)

  try {
    
   const response = await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`,
    jobId
   );

   // send the mail to user
               await axios.post("/api/thankyou",{
                fullName :userProfile?.fullName,
                email:userProfile?.email,
               })
            
   toast.success("JOB Applied")

  } catch (error) {
    console.log((error as Error)?.message)
    toast.error("something went wrong")
  }finally{
    setOpen(false)
    setIsLoading(false)
   router.refresh()


  }
}

return<>
<ApplyModal 
isOpen ={open} 
onClose={()=>setOpen(false)} 
onConfirm={onApplied}
 loading={isLoading}
  userProfile={userProfile}/>

  
  {userProfile && userProfile?.appliedJobs.some(appliedJob =>appliedJob.jobId===jobId)&&(
<Banner 
   variant={"success"}
    label ="Thank you for applying ! Your application has been received, and we're reviewing it carfully. w'll be in touch soon with an update"
   
/>
  ) }
 <Box className="mt-4">



<CustomBreadCrumb 
breadcrumbItem={[{label: "Search",link:"/search"}]}
breadCrumbPage={job?.title !== undefined ? job.title:""}
/>
  

</Box>


{/* job cover image */}

<Box className="mt-4 ">
  <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
    {
      job?.imageUrl ?(<Image
      alt={job.title}
      fill
      className="object-cover w-full h-full"
      src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvi7hCG81V1BSAym7CqlvRIF_sbPo7IV7zHQ&s"}
      />):(
      
     <div className="w-full h-full bg-purple-100 flex items-center justify-center">
      <h2 className="text-3xl font-semibold tracking-wider">
        {job.title}
      </h2>
     </div>
  )  }
  </div>


</Box>
{/* title and action button */}

<Box className="mt-4">
  <div className="space-y-2">
  <h2 className="text-2xl font-semibold text-neutral-600">
{job?.title}

  </h2>

  <Link href={`/companies/${job.companyId}`}>
  <div className="flex items-center gap-2 mt-1">

    {job?.company?.logo &&(
<Image
      alt={job.company.name}
      width={25}
      height={25}
      className="object-cover w-full h-full"
      src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvi7hCG81V1BSAym7CqlvRIF_sbPo7IV7zHQ&s"}
      />

    )}
    <p className="text-muted-foreground text-sm font-semibold">
      {job?.company?.name}
    </p>
  </div>
</Link>
  
  </div>



{/* action button */}
<div>
  {userProfile ? (
    <>
      {userProfile.appliedJobs && userProfile.appliedJobs.some(appliedJob => appliedJob.jobId === jobId) ? (
        <Button className="text-sm bg-purple-700 hover:shadow-sm">
          Already Applied
        </Button>
      ) : (
        <Button className="text-sm bg-purple-900 hover:bg-purple-800 shadow-sm" onClick={()=> setOpen(true)}>
          Apply
        </Button>
      )}
    </>
  ) : (
    <Link href="/user">
      <Button className="text-sm px-8 bg-purple-900 hover:bg-purple-800 shadow-sm">
        Update Profile
      </Button>
    </Link>
  )}
</div>
</Box>
   

   {/* Descripton */}
   <Box className="flex-col my-4 items-start justify-start px-4 gap-2">

    <h2 className="text-lg font-semibold">Description:</h2>
    <p className="font-sans">{job?.short_description}</p>
   </Box>

   {job?.description &&(

    <Box>
        <Preview value={job?.description}/>
    </Box>
   )}
</>
}