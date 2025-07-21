"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Lightbulb, Loader, Loader2, Pencil, X } from "lucide-react";
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
interface TagsFormProps {
  initialData: Job
  jobId: string, 

}

const formSchema = z.object({
  tags: z.array(z.string()).min(1)
});


export const TagsForm= ({ initialData, jobId, }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState('')
    const [isPrompting, setIsPrompting] = useState(false)
const [jobtags, setJobTags] = useState<string[]>(initialData.tags)
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
    
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
    
  };

  const toggleEditing = () => setIsEditing((current) => !current);
  const handlePromptGeneration = async()=>{

try {setIsPrompting(true);

  const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
  await getGenerativeAIResponse(customPrompt).then((data)=>{

//check the data is array or not
// console.log("in Client SIde:", JSON.parse(data))
if(Array.isArray(JSON.parse(data))){
 setJobTags((prevTags)=>[...prevTags, ...JSON.parse(data)])
}
    setIsPrompting(false);
  });
  
} catch (error) {
  // console.log(error)
  toast.error("something went wrong")
}
  }
 const handleTagRemove = (index:number)=>{
     
         const updatedTags = [...jobtags]
         updatedTags.splice(index,1)

         setJobTags(updatedTags)

 }

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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

      {/* Display the tag if not editing */}
      {!isEditing && (

                 <div className="flex items-center flex-wrap gap-2">
                  {initialData.tags.length>0?(initialData.tags.map((tag,index)=>(
                    <div className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>{tag}</div>
                  ))):
                  (<p>No tags</p>
                    
                  )}
                 </div>

      )
      
      
      }

      {/* Display the descwhen editing */}
      {isEditing && 
       <>
         <div className="flex items-center gap-2 my-2">

           <input type="text" placeholder="e.g 'Full-Stack Developer" value={prompt} onChange={(e)=>setPrompt(e.target.value)}
           
           
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

         <p className="text-xs text-muted-foreground text-right">Note*: Professional name alone enough to generate the tags</p>

<div className="flex items-center gap-2 flex-wrap">
            {jobtags.length >0?(jobtags.map((tag,index)=>(
              
<div key={index} className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100">{tag}{isEditing
&&(
  <Button variant={"ghost"} className="p-0 h-auto" onClick={()=> handleTagRemove(index)}><X className="h-3 w-3"/></Button>
)}
  </div>

            ))):<p>No Tags</p>}
  </div>
       

       <div className=" flex items-center-safe gap-2 justify-end mt-4">
        <Button type="button" variant={"outline"}
        onClick={()=>{
          setJobTags([])
          onSubmit({tags:[]})
        }} disabled={isSubmitting}
        
        >Clear All</Button>
                <Button type="submit" disabled={isSubmitting} onClick={()=>{
                  onSubmit({tags:jobtags})
                }}>Save</Button>
 
       </div>
         </>
         
        
      }
    </div>
  );
};