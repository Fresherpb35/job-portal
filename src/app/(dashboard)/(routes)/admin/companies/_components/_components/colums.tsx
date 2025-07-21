"use client"

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

export type CompanyColums= {
  id: string;
  name:string;
  logo:string;
createdAt: string;

 
}

export const columns: ColumnDef<CompanyColums>[] = [
 
  {
    accessorKey: "name",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
   Name
         <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
   },
   
 
  {
    accessorKey: "createdAt",
 header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
    Date
         <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  
  {
    id: "actions",
    cell:({row})=>{
        const {id} = row.original;
    return(
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant={"ghost"} size={"icon"}><MoreHorizontal className="h-4 w-4"/></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
 <Link href={`/admin/companies/${id}`}>
 <DropdownMenuItem>
    <Pencil className="w-4 h-4 mr-2"/>
    Edit
    </DropdownMenuItem></Link>

    {/* <Link href={`/admin/companies/${id}/applicants`}>
 <DropdownMenuItem>
    <Pencil className="w-4 h-4 mr-2"/>
Applicants
    </DropdownMenuItem></Link> */}
  </DropdownMenuContent>
</DropdownMenu>
    )
    }
  }
]