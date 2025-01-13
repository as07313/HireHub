import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
    return <div>Job not found</div>
  }

  return (
    <JobDetails 
      job={job}
      backLink="/dashboard/find-jobs"
      backLabel="Back to Jobs"
      showApplyButton={true}
    />
  )
}