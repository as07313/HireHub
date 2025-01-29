// app/candidate/dashboard/find-jobs/[id]/job-details-client.tsx
"use client"

import { useJobs } from "@/hooks/use-jobs"
import { notFound } from "next/navigation"
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { BaseJob } from "@/app/types/job"

interface JobDetailsClientProps {
  jobId: string
}

export function JobDetailsClient({ jobId }: JobDetailsClientProps) {
  const { jobs, loading, error } = useJobs()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  const job = jobs.find((j) => j._id === jobId) as BaseJob | undefined

  if (!job) {
    return notFound()
  }

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
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
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