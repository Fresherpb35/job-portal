import { db } from "@/lib/db";
import { SearchContainer } from "../../components/ui/search-container"; // Fixed typo: conatiner -> container
import { auth } from "@clerk/nextjs/server";
import { getJobs } from "../../../../../actions/get-jobs";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";

// Define the props interface with searchParams as a Promise
interface SearchProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  // Await searchParams to get the values
  const { title, categoryId, createdAtFilter, shiftTiming, workMode, yearsOfExperience } = await searchParams;

  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Await auth to get userId
  const { userId } = await auth();

  // Fetch jobs with search parameters
  const jobs = await getJobs({ title, categoryId, createdAtFilter, shiftTiming, workMode, yearsOfExperience });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="p-6">
        <CategoriesList categories={categories} />
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;
