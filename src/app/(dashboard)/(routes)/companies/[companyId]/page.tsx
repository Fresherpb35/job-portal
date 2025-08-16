import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Box from "@/app/(dashboard)/components/box";
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb";
import Image from "next/image";
import CompanyDetailContentPage from "../_components/company-detail-content";

// Define the props interface with params as a Promise
interface CompanyDetailPageProps {
  params: Promise<{ companyId: string }>;
}

const CompanyDetailPage = async ({ params }: CompanyDetailPageProps) => {
  // Await params to get the companyId
  const { companyId } = await params;

  // Validate MongoDB ObjectId
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(companyId)) {
    return redirect("/");
  }

  // Await auth to get userId
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch the company by ID
  const company = await db.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return redirect("/");
  }

  // Fetch jobs for the company
  const jobs = await db.job.findMany({
    where: { companyId },
    include: { company: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb
          breadcrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company.name}
        />
      </Box>

      <div className="w-full flex items-center justify-center overflow-hidden relative h-80 z-0">
        {company.coverImage ? (
          <Image
            alt={company.name}
            src={company.coverImage}
            fill
            className="object-cover"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-700">{company.name}</h2>
        )}
      </div>

      <CompanyDetailContentPage
        jobs={jobs}
        company={company}
        userId={userId}
      />
    </div>
  );
};

export default CompanyDetailPage;
