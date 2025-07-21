"use client"

import { Company, Job } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/ui/preview";
import JobsTabContent from "./jobs-tab-content";

interface TabContentSectionPageProps {
  userId: string | null;
  company: Company;
  jobs: Job[];
}

const TabContentSection = ({ userId, company, jobs }: TabContentSectionPageProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full max-w-5xl px-4">
        <TabsList className="bg-transparent shadow-none w-full flex gap-4 border-b">
          <TabsTrigger
            value="overview"
            className="
              border-b-2 border-transparent
              data-[state=active]:border-purple-500
              rounded-none bg-transparent text-base font-sans tracking-wide shadow-none
            "
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="whyJoinUs"
            className="
              border-b-2 border-transparent
              data-[state=active]:border-purple-500
              rounded-none bg-transparent text-base font-sans tracking-wide shadow-none
            "
          >
            Why Join Us
          </TabsTrigger>

          <TabsTrigger
            value="jobs"
            className="
              border-b-2 border-transparent
              data-[state=active]:border-purple-500
              rounded-none bg-transparent text-base font-sans tracking-wide shadow-none
            "
          >
            Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {company.overview ? <Preview value={company.overview} /> : <p>No overview available.</p>}
        </TabsContent>

        <TabsContent value="whyJoinUs" className="mt-4">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs} /> : <p>No details available.</p>}
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <JobsTabContent userId={userId} jobs={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabContentSection;
