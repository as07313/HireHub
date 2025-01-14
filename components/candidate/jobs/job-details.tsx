// components/jobs/job-details.tsx
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JobHeader } from "@/components/candidate/jobs/job-header"
import { JobTabs } from "@/components/candidate/jobs/job-tabs"
import { JobOverview } from "@/components/candidate/jobs/job-overview"
import { JobBenefits } from "@/components/candidate/jobs/job-benefits"

interface JobDetailsProps {
  job: {
    id: string
    title: string
    company: string
    logo: string
    location: string
    salary: string
    type: string
    experience: string
    description: string
    companyDescription: string
    requirements: string[]
    responsibilities: string[]
    skills: string[]
    teamSize: string
    benefits: string[]
    postedDate: string
    employmentType: string
    workplaceType: string
    education: string
    status?: 'active' | 'interviewing' | 'offered' | 'rejected'
    appliedDate?: string
  }
  backLink: string
  backLabel: string
  showActions?: boolean
  showApplyButton?: boolean
}

export function JobDetails({ 
  job, 
  backLink, 
  backLabel,
  showActions = false,
  showApplyButton = false 
}: JobDetailsProps) {
  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link 
        href={backLink} 
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <JobHeader job={job} showActions={showActions} />
          <JobTabs job={job} />
        </div>

        <div className="space-y-6">
          <JobOverview job={job} showApplyButton={showApplyButton} />
          <JobBenefits benefits={job.benefits} />
        </div>
      </div>
    </div>
  )
}