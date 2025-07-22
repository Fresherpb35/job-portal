import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Box from "@/app/(dashboard)/components/box";
import { CustomBreadCrumb } from "@/components/ui/custom-bread-crumb";
import Image from "next/image";
import CompanyDetailContentPage from "../_components/company-detail-content";


const CompanyDetailPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const authResult = await auth();
  const userId = authResult?.userId ?? null;

  const company = await db.company.findUnique({
    where: { id: params.companyId },
  });

  if (!company || !userId) {
    redirect("/");
  }

  const jobs = await db.job.findMany({
    where: { companyId: params.companyId },
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
