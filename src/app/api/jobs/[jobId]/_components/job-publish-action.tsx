"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);

    console.log("JobPublishAction rendered:", { disabled, isLoading }); // Add this line


  const onClick = async () => {
    console.log("Publish button clicked");

    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job Unpublished");
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job Published");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = () => {
    toast("Delete functionality not implemented yet.");
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled || isLoading}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant="destructive"
        size="icon"
        disabled={isLoading}
        onClick={onDelete}
        aria-label="Delete Job"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
