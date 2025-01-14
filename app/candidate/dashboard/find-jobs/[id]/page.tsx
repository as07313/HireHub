// app/candidate/dashboard/jobs/[id]/page.tsx
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { jobs } from "@/lib/data/jobs"

// app/candidate/dashboard/jobs/[id]/page.tsx
export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const jobData = jobs.find((j) => j.id === params.id)

  if (!jobData) {
    notFound()
  }

  // Convert readonly arrays to mutable arrays
  const job = {
    ...jobData,
    requirements: [...jobData.requirements],
    responsibilities: [...jobData.responsibilities],
    skills: [...jobData.skills],
    benefits: [...jobData.benefits]
  }

  return (
    <JobDetails 
      job={job}
      backLink="/dashboard/jobs"
      backLabel="Back to Jobs"
      showActions={false}
      showApplyButton={true}
    />
  )
}