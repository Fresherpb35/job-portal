"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react";

interface CustomBreadCrumbProps {
  breadCrumbPage: string,
  breadcrumbItem?: { link: string; label: string }[];
}

export const CustomBreadCrumb = ({ breadCrumbPage, breadcrumbItem }: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center justify-center">
            <Home className="w-3 h-3 mr-2" /> Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItem?.map((item, index) => (
          <div key={item.link || index} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}

        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
