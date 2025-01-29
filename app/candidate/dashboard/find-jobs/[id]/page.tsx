// app/candidate/dashboard/find-jobs/[id]/page.tsx
"use client"

import * as React from 'react'
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { useJobs } from "@/hooks/use-jobs"
import { BaseJob } from "@/app/types/job"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobDetailsPage({ params }: PageProps) {
  // Await the params
  const { id } = await params
  const { jobs, loading, error } = useJobs()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  const job = jobs.find((j) => j._id === id) as BaseJob | undefined

  if (!job) {
    return notFound()
  }

  // Transform job data to match JobDetailsProps interface
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