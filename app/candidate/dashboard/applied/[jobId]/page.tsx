import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JobHeader } from "@/components/jobs/job-header"
import { JobTabs } from "@/components/jobs/job-tabs"
import { JobOverview } from "@/components/jobs/job-overview"
import { JobBenefits } from "@/components/jobs/job-benefits"
import { appliedJobs } from "@/lib/data/applied-jobs"

export function generateStaticParams() {
  return appliedJobs.map((job) => ({
    jobId: job.id,
  }))
}

export default function AppliedJobDetailsPage({ params }: { params: { jobId: string } }) {
  const job = appliedJobs.find((j) => j.id === params.jobId)

  if (!job) {
    return <div>Job not found</div>
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link href="candidate/dashboard/applied" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applied Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <JobHeader job={job} />
          <JobTabs job={job} />
        </div>

        <div className="space-y-6">
          <JobOverview job={job} />
          <JobBenefits benefits={job.benefits} />
        </div>
      </div>
    </div>
  )
}