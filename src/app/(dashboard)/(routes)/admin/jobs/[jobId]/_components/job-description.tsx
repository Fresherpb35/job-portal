"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Copy, Lightbulb, Loader, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { debounce } from "lodash";
import { Job } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "../../../../../../../../scripts/aistudio";
import { Editor } from "@/components/ui/editor";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/ui/preview";

interface JobDescriptionProps {
  initialData: Job
  jobId: string, 

}

const formSchema = z.object({
  description: z.string().trim().min(1, "Required"),
});


export const JobDescription= ({ initialData, jobId, }: JobDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState('')
    const [skills, setSkills] = useState('')
    const [aiValue, setAiValue] = useState('')

    const [isPrompting, setIsPrompting] = useState(false)
   

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
     description: initialData?.description||""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    
    try {
      
    const response = await axios.patch(`/api/jobs/${jobId}`,values)

  toast.success("job updated")
  toggleEditing();
  router.refresh();
} catch (error) {
  toast.error("something went wrong")
}
    // debouncedSubmit(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);
  const handlePromptGeneration = async()=>{

try {setIsPrompting(true);
     const customPrompt = `Could you please draft a job requirements document for the position of ${rollname}? The job description should include roles & responsibilities, kěy features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you han list any optional skill related to job. Thanks!`;

  await getGenerativeAIResponse(customPrompt).then((data)=>{
    data = data.replace(/^'|'$/g,"");
    let CleanedText = data.replace(/[\*\#]/g,"")
setAiValue(CleanedText)
setIsPrompting(false)

  })
  
} catch (error) {
  console.log(error)
  toast.error("something went wrong")
}
  }
  const onCopy = () =>{

      navigator.clipboard.writeText(aiValue)
      toast.success("copied to clipboard")
  }

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job  Description
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

      {/* Display the title if not editing */}
      {!isEditing && (

                <div className={cn("text-sm mt-2", !initialData.description && "text-neutral-500")}>

                  {initialData.description && "No Description"}
                  {initialData.description &&(
                    <Preview value={initialData.description}/>
                  )}
                </div>

      )
      
      
      }

      {/* Display the descwhen editing */}
      {isEditing && 
       <>
         <div className="flex items-center gap-2 my-2">

           <input type="text" placeholder="e.g 'Full-Stack Developer" value={rollname} onChange={(e)=>setRollname(e.target.value)}
           
           
           className="w-full p-2 rounded-md"/>
              <input type="text" placeholder="e.g 'Required Skills sets" value={skills} onChange={(e)=>setSkills(e.target.value)}
           
           
           className="w-full p-2 rounded-md"/>
           {isPrompting?(<>
           
           <Button>
            <Loader2 className="w-4 h-4 animate-spin"/>
            </Button></>
           ):(
            <>
            <Button onClick={handlePromptGeneration}>
              <Lightbulb className="w-4 h-4" />
            </Button>
            </>
     )     }

         </div>

         <p className="text-xs text-muted-foreground text-right">Note: Professional Name & Required skills delimetted by comma</p>


{aiValue &&(
  <div className="w-full h-96 max-h=96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">

    {aiValue}
    <Button className="absolute top-3 right-3 z-10" variant={"outline"} size={"icon"} onClick={onCopy}>

      <Copy className="w-4 h-4" />
    </Button>
  </div>
)}
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
              <FormControl>
               <Editor {...field} />
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
         </>
         
        
      }
    </div>
  );
};