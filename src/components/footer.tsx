"use client";

import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";
import Box from "@/app/(dashboard)/components/box";

import Logo from "@/app/(dashboard)/components/logo";
import { Separator } from "@radix-ui/react-dropdown-menu";

const menuOne = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Employer home" },
  { href: "#", label: "Sitemap" },
  { href: "#", label: "Credits" },
];

export const Footer = () => {
  return (
    <div className="w-full p-6 bg-neutral-50 flex flex-col gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-8">
        {/* first section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-semibold text-muted-foreground">
              WorkNow
            </h2>
          </div>
          <p className="font-semibold text-base">Connect with us</p>
          <div className="flex items-center gap-4">
            <Link href={"https://www.facebook.com"}>
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>
            <Link href={"https://www.twitter.com"}>
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>
            <Link href={"https://www.linkedin.com"}>
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>
            <Link href={"https://www.youtube.com"}>
              <Youtube className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>
          </div>
        </div>

        {/* menu sections */}
        {/* <div className="flex flex-col gap-3">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </div> */}

        <div className="flex flex-col gap-3">
          {menuOne.map((item) => (
            <Link key={item.label + '-copy'} href={item.href}>
              <p className="text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        {/* App Download Section */}
        <Card className="col-span-2 p-6 flex flex-col gap-3">
          <CardTitle className="text-base">Apply on the go</CardTitle>
          <CardDescription>
            Get real-time job updates on our App
          </CardDescription>
          <Link href={"#"}>
            <div className="w-full h-16 relative">
              <Image
                src={"/img/1_sSR4mrpijxoQrD7HKu8nDw.png"}
                fill
                className="object-contain"
                alt="Play Store & Apple Store"
              />
            </div>
          </Link>
        </Card>
      </div>

      <Separator />

      <div className="text-center text-sm text-muted-foreground py-4">
        All rights reserved &copy; 2024
      </div>
    </div>
  );
};
