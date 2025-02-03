// app/candidate/dashboard/find-jobs/[id]/job-details-client.tsx
"use client"

import { useState } from "react"
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { BaseJob } from "@/app/types/job"

interface JobDetailsClientProps {
  jobId: string
  initialJob: BaseJob
}

// Helper function to convert string or array
function convertToArray(value: string[] | string | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split('\n').filter(Boolean);
  }
  return [];
}

// Helper function to convert skills string or array
function convertSkillsToArray(value: string[] | string | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export function JobDetailsClient({ jobId, initialJob }: JobDetailsClientProps) {
  const [job, setJob] = useState(initialJob)

  const transformedJob = {
    id: job._id,
    recruiterId: '',
    title: job.title,
    department: job.department,
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    status: job.status,
    salary: {
      min: job.salary.min,
      max: job.salary.max
    },
    experience: job.experience,
    description: job.description,
    requirements: convertToArray(job.requirements),
    benefits: convertToArray(job.benefits),
    skills: convertSkillsToArray(job.skills),
    postedDate: new Date(job.postedDate),
    logo: '/company-placeholder.png',
    company: job.department,
    companyDescription: ''
  }

  return (
    <JobDetails 
      job={transformedJob}
      backLink="/candidate/dashboard/find-jobs"
      backLabel="Back to Jobs"
      showActions={true}
      showApplyButton={true}
    />
  )
}