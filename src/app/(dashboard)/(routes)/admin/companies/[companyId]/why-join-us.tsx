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
import { Company } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import getGenerativeAIResponse from "../../../../../../../../scripts/aistudio";
import { Editor } from "@/components/ui/editor";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/ui/preview";
import getGenerativeAIResponse from "../../../../../../../scripts/aistudio";

interface WhyJoinUsFormProps {
  initialData: Company
   companyId: string, 

}

const formSchema = z.object({
  whyJoinUs: z.string().trim().min(1, "Required"),
});


export const WhyJoinUs= ({ initialData,    companyId }: WhyJoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState('')
    const [aiValue, setAiValue] = useState('')

    const [isPrompting, setIsPrompting] = useState(false)
   

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
     whyJoinUs: initialData?.whyJoinUs||""
    },
  }); 

  const { isSubmitting, isValid } = form.formState;

  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   
    
    try {
      
    const response = await axios.patch(`/api/companies/${companyId}`,values)

  toast.success("company updated")
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
    const customPrompt = `Create a compelling "Why join us" content piece for ${rollname}. Highlight the unique opportunities, benefits, and experiences that ${rollname} offers to its users. Emphasize the platform's value proposition, such as access to a vast music library, personalized recommendations exclusive content, community features, and career opportunities for musicians and creators. Tailor the content to attract potential users and illustrate why ${rollname} stands out among other music streaming platforms.`;


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
Why Join us
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

                <div className={cn("text-sm mt-2", !initialData.whyJoinUs && "text-neutral-500")}>

                  {initialData.whyJoinUs && "No Details"}
                  {initialData.whyJoinUs&&(
                    <Preview value={initialData.whyJoinUs}/>
                  )}
                </div>

      )
      
      
      }

      {/* Display the descwhen editing */}
      {isEditing && 
       <>
         <div className="flex items-center gap-2 my-2">

           <input type="text" placeholder="e.g 'Hoping Minds" value={rollname} onChange={(e)=>setRollname(e.target.value)}
           
           
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

         <p className="text-xs text-muted-foreground text-right">Note: Type the company Name overhere to generate the overview content</p>


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
              name="whyJoinUs"
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