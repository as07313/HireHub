// app/candidate/dashboard/jobs/[id]/page.tsx
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/jobs/job-details"
import { jobs } from "@/lib/data/jobs"

export function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }))
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id)

  if (!job) {
    notFound()
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