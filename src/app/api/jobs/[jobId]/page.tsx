export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JobPublishAction } from "./_components/job-publish-action";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-badge";
import { TitleForm } from "./_components/title-form";


const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;

  // Verify the MongoDB ObjectId
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
  });
const categories = await db.category.findMany({
  orderBy:{ name :"asc"},
})
  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [job.title, job.description, job.imageUrl,job.categoryId];

  
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>

        {/* action button */}
        <JobPublishAction
         key={job.id}
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* warning before publishing the course */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is not published yet. It will not be visible in the job list"
        />
      )}

      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>

          {/* title form */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* category from */}

      
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;