"use client"

import { Card } from "@/components/ui/card"
import { Company } from "@/generated/prisma"
import Box from "./box"
import { useRouter } from "next/navigation"

interface HomeCompaniesListProps{
    companies :Company[]
}
const HomeCompaniesList = ({companies}:HomeCompaniesListProps) => {

    const CompanyListItemCard = ({company}:{company:Company})=>{


      const router   = useRouter();

return(
<Card className="p-4 flex items-center gap-2 text-muted-foreground hover:text-purple-500 hover:border-purple-500 hover:shadow-md cursor-pointer" onClick={()=>router.push(`/companies/${company.id}`)}>
    <h2 className="font-serif font-semibold tracking-wide whitespace-nowrap">{company.name}</h2>
</Card>

)

    }
  return (
    <div className="flex-col my-12">
        <h2 className="text-2xl tracking-wider font-bold font-sans text-center">
            Featured companies actively hiring
        </h2>
      <div className="mt-12 w-full flex items-center justify-center flex-wrap gap-4">
        {companies.map(item=>(
            <CompanyListItemCard company={item} key={item.id} />
        ))}
      </div>
    </div>
  )
}

export default HomeCompaniesList
