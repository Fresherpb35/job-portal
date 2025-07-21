"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Box from "./box";

const HomeSearchContainer = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
      },
    });
    router.push(href);
  };

  return (
    <div className="w-full flex justify-center mt-8 px-4">
      <div className="w-full max-w-3xl flex items-center p-4 rounded-full h-16 shadow-lg gap-3 bg-neutral-50">
        <Input
          placeholder="Search by job name"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-lg font-sans bg-transparent outline-none border-none focus:ring-0 focus:outline-none"
        />
        <Button
          onClick={handleClick}
          disabled={!title}
          className="bg-purple-600 hover:bg-purple-700 rounded-full"
          size={"icon"}

         
        >
           <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default HomeSearchContainer;
