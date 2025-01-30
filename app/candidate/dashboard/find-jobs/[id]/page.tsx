// app/candidate/dashboard/find-jobs/[id]/page.tsx
import { Suspense } from "react"
import { JobDetailsClient } from "./job-details-client"
import { findJobs } from "@/app/actions/find-jobs"
import { notFound } from "next/navigation"
import { BaseJob } from "@/app/types/job"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 3600 // Revalidate every hour

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params
  const jobs = await findJobs()
  console.log("jobs", jobs)
  console.log("id",id)
  const foundJob = jobs.find(j => j._id.toString() === id)

  

  // Transform the job data to match BaseJob interface
  const job: BaseJob = {
    _id: foundJob._id.toString(),
    title: foundJob.title,
    department: foundJob.department,
    location: foundJob.location,
    workplaceType: foundJob.workplaceType as 'onsite' | 'hybrid' | 'remote',
    employmentType: foundJob.employmentType as 'full-time' | 'part-time' | 'contract' | 'internship',
    status: foundJob.status as 'active' | 'inactive' | 'closed',
    salary: {
      min: foundJob.salary.min,
      max: foundJob.salary.max
    },
    experience: foundJob.experience as 'entry' | 'mid' | 'senior' | 'lead',
    description: foundJob.description,
    requirements: foundJob.requirements || [],
    benefits: foundJob.benefits || [],
    skills: foundJob.skills || [],
    postedDate: new Date(foundJob.postedDate)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobDetailsClient jobId={id} initialJob={job} />
    </Suspense>
  )
}