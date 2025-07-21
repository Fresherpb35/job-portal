"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { debounce } from "lodash";

interface CompanyNameFormProps {
  initialData: {
    name: string;
  };
  companyId: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const CompanyName = ({ initialData,   companyId }: CompanyNameFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:initialData
  });

  const { isSubmitting, isValid } = form.formState;



  const onSubmit = async (values: z.infer<typeof formSchema>) => {

try {
  const response = await axios.patch(`/api/companies/${companyId}`,values)

  toast.success("job companies")
  toggleEditing();
  router.refresh();
} catch (error) {
  toast.error("something went wrong")
}
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job company
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit 
            </>
          )}
        </Button>
      </div>

      {/* Display the name if not editing */}
      {!isEditing && <p className="text-sm mt-2">{initialData.name}</p>}

      {/* Display the input when editing */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '07 services'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};