// app/candidate/dashboard/find-jobs/[id]/job-details-client.tsx
"use client"

import { useState, useEffect } from "react"
import { useJobs } from "@/hooks/use-jobs"
import { notFound } from "next/navigation"
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { BaseJob } from "@/app/types/job"

interface JobDetailsClientProps {
  jobId: string
  initialJob: BaseJob
}

export function JobDetailsClient({ jobId, initialJob }: JobDetailsClientProps) {
  const [job, setJob] = useState(initialJob) 

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // if (error) {
  //   return <div>Error loading job details</div>
  // }

  //const job = jobs.find((j) => j._id === jobId) as BaseJob | undefined
 console.log("find", job)

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
  // Convert requirements to array if it's a string
  requirements: Array.isArray(job.requirements) 
    ? job.requirements 
    : job.requirements?.split('\n').filter(Boolean) || [],
  // Convert benefits to array if it's a string  
  benefits: Array.isArray(job.benefits)
    ? job.benefits
    : job.benefits?.split('\n').filter(Boolean) || [],
  // Convert skills to array if it's a string
  skills: Array.isArray(job.skills) 
    ? job.skills 
    : job.skills?.split(',').map(s => s.trim()).filter(Boolean) || [],
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