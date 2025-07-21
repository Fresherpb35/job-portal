"use client"

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

export type ApplicantColumns= {
  id: string;
fullName: string;
email:string;
contact:string;
appliedAt: boolean;


 
}

export const columns: ColumnDef<ApplicantColumns>[] = [
  {
    accessorKey: "fullName",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
Full Name
         <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
   },
   {
    accessorKey: "email",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
                   Email
             <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
   },
  {
    accessorKey: "contact",
   header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
    Contact
         <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
     Company
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
 <Link href={`/admin/jobs/${id}`}>
 <DropdownMenuItem>
    <Pencil className="w-4 h-4 mr-2"/>
    Edit
    </DropdownMenuItem></Link>

    {/* <Link href={`/admin/jobs/${id}/applicants`}>
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