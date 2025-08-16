// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { ApplicantColumns } from "./_components/colums";

// const JobApplicantpage = async ({ params }: { params: { jobId: string } }) => {
//   const { userId } = await auth();

//   const job = await db.job.findUnique({
//     where: {
//       id: params.jobId,
//       userId: userId as string,
//     },
//   });

//   if (!job) {
//     redirect("/admin/jobs");
//   }

//   // 👇 include appliedJobs relation if you need it
//   const profiles = await db.userProfile.findMany({
//     include: {
//       resumes: {
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//       appliedJobs: true, // <-- important if relation exists in schema
//     },
//   });

//   // Filter profiles that applied for this job
//   const filteredProfiles =
//     profiles?.filter((profile) =>
//       profile.appliedJobs.some(
//         (appliedJob) => appliedJob.jobId === params.jobId
//       )
//     ) || [];

//   // Map to ApplicantColumns format
//   const formattedProfiles: ApplicantColumns[] = filteredProfiles.map(
//     (profile) => ({
//       id: profile.userId,
//       fullName: profile.fullName ?? "",
//       email: profile.email ?? "",
//       contact: profile.contact ?? "",
//       appliedAt: profile.appliedJobs, // probably you want createdAt instead?
//     })
//   );

//   return <div>{/* render formattedProfiles here */}</div>;
// };

// export default JobApplicantpage;
