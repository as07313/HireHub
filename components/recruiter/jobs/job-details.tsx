"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"
import { Job } from "@/app/types/job"
import { useRouter } from "next/navigation"

interface JobDetailsProps {
  job: Job
}

export function JobDetails({ job }: JobDetailsProps) {
  // Convert requirements and benefits to arrays if they're strings
  
  const router = useRouter()
  const requirementsList = Array.isArray(job.requirements) 
    ? job.requirements 
    : [job.requirements].filter(Boolean)

  const benefitsList = Array.isArray(job.benefits) 
    ? job.benefits 
    : [job.benefits].filter(Boolean)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Job Description</h2>
        <p className="text-muted-foreground whitespace-pre-line">
          {job.description}
        </p>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Requirements</h2>
        <div className="grid gap-3">
          {requirementsList.map((requirement: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>{requirement}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Benefits</h2>
        <div className="grid gap-3">
          {benefitsList.map((benefit: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
      <Button 
        variant="outline" 
        onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
      >
        Edit Job
      </Button>
      </div>
    </div>
  )
}