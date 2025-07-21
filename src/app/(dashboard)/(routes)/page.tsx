import { auth } from "@clerk/nextjs/server"
import { getJobs } from "../../../../actions/get-jobs";
import { db } from "@/lib/db";
import Box from "../components/box";
import HomeSearchCantainer from "../components/home-search-container";
import Image from "next/image";
import HomeScreenCategoriesContainer from "../components/home-screen-categories-cantainer";
import HomeCompaniesList from "../components/home-companies-list";
import RecommendedJobsList from "../components/recommended-jobs";
import { Footer } from "@/components/footer";

const DashboardHomePage = async () =>{


       const {userId} = await auth();
       const jobs =await getJobs({})

       const categories = await db.category.findMany({

        orderBy:{name:"asc"}

       })
       const companies = await db.company.findMany({
        where:{
            userId : userId as string
        },
        orderBy:{
            createdAt:"desc"
        }
       })
    return (

  <div className="flex flex-col items-center justify-center py-6 px-4 space-y-24">
    <div className="flex flex-col items-center justify-center w-full space-y-4 mt-12 text-center">
      <h2 className="text-2xl md:text-6xl font-sans font-bold tracking-wide text-neutral-600">
        Find your dream job now
      </h2>
     <p className="text-2xl text-muted-foreground">
        {jobs.length} + jobs for you to explore
      </p>
    </div>


    <HomeSearchCantainer />
<div className="relative overflow-hidden h-64 2xl:h-96 justify-center">
<Image 
  src="/img/we-are-hiring-digital-collage.jpg"
  alt="Home Banner"
  width={1000}
  height={240}
className="object-cover rounded-lg"

/>
    </div>
<HomeScreenCategoriesContainer categories={categories} />


<HomeCompaniesList companies={companies} />

<RecommendedJobsList jobs={jobs.splice(0,6)} userId={userId} />

<Footer />
  </div>
    )
}
export default DashboardHomePage