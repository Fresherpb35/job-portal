"use client"

import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import {  LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { SearchContainer } from "./ui/search-conatiner"


function NavbarRoutes() {

    const pathname = usePathname()

    const isAdminPage = pathname?.startsWith('/admin')

     const isPlayerPage = pathname?.startsWith('/jobs')
        const isSearchPage = pathname?.startsWith('/search')
  return (
    <>
    {isSearchPage &&(

      <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
        <SearchContainer />
      </div>
    ) }
      <div className="flex gap-x-2 ml-auto">
{
isAdminPage || isPlayerPage ?(
<Link href={'/'}>
    <Button variant={"outline"} size={"sm"} className="border-purple-700/20">
        <LogOut/>
        Exit
    </Button>
</Link>
):(<Link href={'/admin/jobs'}>
    <Button variant={"outline"} size={"sm"} className="border-purple-700/20">
      Admin Mode
    </Button>
</Link>
)}
        <UserButton afterSignOutUrl="/"/>
      </div>
    </>
  ) 
}

export default NavbarRoutes

