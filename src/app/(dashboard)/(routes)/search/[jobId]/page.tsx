import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobDetailsPageContent } from "./_components/job-details-page-content";
import Box from "@/app/(dashboard)/components/box";
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb";
import { PageContent } from "../_components/page-content";
import { Separator } from "@radix-ui/react-dropdown-menu"
  import { getJobs } from "../../../../../../actions/get-jobs";

// Define the props interface with params as a Promise
interface JobDetailsPageProps {
  params: Promise<{ jobId: string }>;
}

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  // Await params to get the jobId
  const { jobId } = await params;

  // Validate MongoDB ObjectId
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/search");
  }

  // Await auth to get userId
  const { userId } = await auth();
  if (!userId) {
    return redirect("/search");
  }

  // Fetch the job by ID
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job) {
    return redirect("/search");
  }

  // Fetch the user profile
  const profile = await db.userProfile.findUnique({
    where: { userId },
  });

  // Fetch related jobs
  const jobs = await getJobs({});
  const filteredJobs = jobs.filter(
    (j) => j.id !== job.id && j.categoryId === job.categoryId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailsPageContent job={job} jobId={job.id} userProfile={profile} />

      {filteredJobs && filteredJobs.length > 0 && (
        <>
          <Separator className="my-4" />
          <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
            <h2 className="text-lg font-semibold">Related Jobs</h2>
          </Box>
          <PageContent jobs={filteredJobs} userId={userId} />
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;
