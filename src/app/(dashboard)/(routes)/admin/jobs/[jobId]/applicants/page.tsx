// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { ApplicantColumns } from "./_components/colums";

// const JobApplicantpage = async ({params}:{params:{jobId:string}}) => {


//     const {userId} = await auth();
//     const job= await db.job.findUnique({

//         where:{
//             id:params.jobId,
//             userId: userId as string,

//         }
//     })

//     if(!job){
//         redirect("/admin/jobs");
//     }

// let profiles = await db.userProfile.findMany({
//     include:{
//         resumes:{
//             orderBy:{
//                 createdAt :'desc'
//             }
//         }
        
//     }
// })
 
//        const jobs = await db.job.findMany({
//            where:{
//             userId: userId as string,
//            },
//            include:{
//             company:true,
//             category:true,
//            },

//            orderBy:{
//             createdAt:"desc"
//            }
//        })
//        const filteredProfiles = 
//        profiles &&
//        formattedProfiles.filter((profile)=>
//         profile.appliedJobs.some(
//             (appliedJob) => appliedJob.jobId === params.jobId
//         ));
      
//        const formattedProfiles : ApplicantColumns[] = filteredProfiles.map(
//           profile =>({
//             id: profile.userId,
//             fullName : profile.fullName ? profile.fullName: "",

//             email: profile.email ? profile.email :"",
//             contact:profile.contact? profile.contact: "",
//             appliedAt: profile.appliedJobs
//           })
//        )
       
//   return (
//     <div>
//       keifh
//     </div>
//   )
// }

// export default JobApplicantpage 
