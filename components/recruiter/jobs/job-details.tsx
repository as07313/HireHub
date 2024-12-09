"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"

interface JobDetailsProps {
  job: any
}

export function JobDetails({ job }: JobDetailsProps) {
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
          {job.requirements.map((requirement: string, index: number) => (
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
          {job.benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Edit Job</Button>
        <Button>View Applicants</Button>
      </div>
    </div>
  )
}