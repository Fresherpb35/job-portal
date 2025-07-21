import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/ui/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form copy";
import { SocialContactForm } from "./socail-contact";
import { CompanyOverview } from "./company-overview";
import { WhyJoinUs } from "./why-join-us";

const CompanyEditPage = async ({ params }: { params: { companyId: string } }) => {
  const { companyId } = await params;

  // ✅ Validate MongoDB ObjectId
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch the company by ID and userId
  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  // ✅ Required fields check
  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* Title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

     

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left container */}
        <div>
          {/* title */}


          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your company</h2>
          </div>

          {/* name form */}
 <CompanyName initialData={company} companyId={company.id}/>
<CompanyDescriptionForm initialData={company} companyId={company.id}/>
        </div>

        {/* Right container */}
        <div className="space-y-6">
  
<div>
  <div className="flex items-center gap-x-2">
  <IconBadge icon={Network} />
  <h2 className="text-xl"></h2>

  

</div>
<SocialContactForm initialData={company}
companyId={company.id}/>

        </div>


      </div>

      <div className="col-span-2">
<CompanyOverview initialData={company} companyId={companyId}/>

      </div>
      <div className="col-span-2">

        <WhyJoinUs initialData={company} companyId={companyId} />
      </div>
    </div>
    </div>

  );
};

export default CompanyEditPage;
