import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JobHeader } from "@/components/jobs/job-header"
import { JobTabs } from "@/components/jobs/job-tabs"
import { JobOverview } from "@/components/jobs/job-overview"
import { JobBenefits } from "@/components/jobs/job-benefits"
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link href="/dashboard/applied" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
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