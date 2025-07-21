import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb"
import Box from "../../components/box"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import { NameForm } from "./_components/name-form"
import { db } from "@/lib/db"
import { EmailForm } from "./_components/email-form"
import { ContactForm } from "./_components/contact-form"
import { DataTable } from "@/components/ui/data-table"
import { AppliedJobsColumn, columns } from "./_components/column"
import { format } from "date-fns"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { truncate } from "lodash"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"


const ProfilePage = async () =>{

    const {userId} = await auth()
    const user = await currentUser()

if(!userId){
    redirect("/sign-in")
}
let profile = await db.userProfile.findUnique({
    where:{
        userId
    },
   
    
})

const jobs = await db.job.findMany({
  where:{
  userId},
  include:{
    company:true,
    category:true
  },
  orderBy:{
    createdAt:"desc"
  }
})
  const filteredAppliedJobs = profile && profile?.appliedJobs.length >0?
  jobs.filter(job=>profile.appliedJobs.some(appliedJob =>appliedJob.jobId === job.id)).map(job=>({

    ...job,
appliedAt : profile.appliedJobs.find(appliedJob =>appliedJob.jobId ===job.id)?.appliedAt
  })
  )
  :[];
  const formattedJobs : AppliedJobsColumn[] = filteredAppliedJobs.map(job =>({

    id: job.id,
    title:job.title,
    company: job.company ? job.company.name:"",
    category: job.category? job.category?.name:"",
    appliedAt :job.appliedAt? format(new Date(job.appliedAt),"MMMM do,yyyy"):""
  }))
   const followedComapnies =await db.company.findMany({
    where:{
      followers:{
        has:userId
      }
    },
    orderBy:{
      createdAt:"desc"
    }
   })
  

return (
<div className="flex-col p-4 md:p-8 items-center justify-center flex">
        <Box>
<CustomBreadCrumb breadCrumbPage="My Profile" />
        </Box>


       <Box className="p-4 rounded-md border mt-8 w-full space-y-6">

  {user && user.hasImage && (
    <div className="w-full flex justify-center">
      <div className="relative w-26 h-26 rounded-full overflow-hidden shadow-md">
        <Image
          fill
          className="object-cover"
          alt="User Profile Pic"
          src={user.imageUrl}
        />
      </div>
    </div>
  )}


</Box>
  <NameForm initialData={{ fullName: profile?.fullName ?? null }} userId={userId}  />
  <EmailForm
    initialData={{
      userId: profile?.userId ?? userId,
      fullName: profile?.fullName ?? null,
      email: profile?.email ?? null,
      contact: profile?.contact ?? null,
      appliedJobs: profile?.appliedJobs ?? [],
    }}
    userId={userId}
  />
  <ContactForm  initialData={{
      userId: profile?.userId ?? userId,
      fullName: profile?.fullName ?? null,
      email: profile?.email ?? null,
      contact: profile?.contact ?? null,
      appliedJobs: profile?.appliedJobs ?? [],
    }}
    userId={userId} />


    {/* applied jobs list table */}
  <h2 className="text-2xl text-muted-foreground font-semibold ">Applied Jobs</h2>
    <Box className="flex-col items-start justify-start mt-12">
    

<div className="
w-full mt-6">

  <DataTable 
columns={columns}
  searchKey="company"
  data={formattedJobs}
  
  
  />
</div>

    </Box>
 <h2 className="text-2xl text-muted-foreground font-semibold ">Followed Companies</h2>

    <Box className="flex-col items-start justify-start mt-12">

      
       <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">

        {followedComapnies.length === 0? <p>No Campanies followed yet</p>:
        
        <>
        {followedComapnies.map(com=>(

          <Card className="p-3 space-y-2 relative" key={com.id}>

           <div className="w-full flex items-center justify-end
           ">

             <Link href={`/companies/${com.id}`}>
            
            
            <Button variant={"ghost"} size={"icon"}>
              <Eye className="w-2 h-2 " />
              </Button></Link>
           </div>

            <CardTitle className="text-lg">{com?.name}</CardTitle>
            {com.description && (

              <CardDescription>
                {truncate(com?.description,{

                  length:80,
                  omission:"..."
                })}
              </CardDescription>
            )}
          </Card>
        ))}
        </>
        }
       </div>
    </Box>
        </div>)
}

export default ProfilePage