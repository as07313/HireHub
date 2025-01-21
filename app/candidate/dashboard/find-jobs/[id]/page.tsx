// app/candidate/dashboard/jobs/[id]/page.tsx
"use client"
import * as React from 'react'
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { useJobs } from "@/hooks/use-jobs"

// app/candidate/dashboard/jobs/[id]/page.tsx
export default function JobDetailsPage({ params }: { params: { id: string } }) {
  
  const { id } = params
  const { jobs , loading , error } = useJobs() 

    if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading job details</div>
  }


  const jobData = jobs.find((j) => j._id === id)

  
  // Convert readonly arrays to mutable arrays
  

  return (
    <JobDetails 
      job={jobData}
      backLink="/candidate/dashboard/find-jobs"
      backLabel="Back to Jobs"
      showActions={true}
      showApplyButton={true}
    />
  )
}