// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { JobHeader } from "@/components/candidate/jobs/job-header"
import { JobTabs } from "@/components/candidate/jobs/job-tabs"
import { JobOverview } from "@/components/candidate/jobs/job-overview"
import { JobBenefits } from "@/components/candidate/jobs/job-benefits"
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation"
import { appliedJobs } from '@/lib/data/applied-jobs'

export function generateStaticParams() {
  return appliedJobs.map((job) => ({
    jobId: job.id,
  }))
}

export default async function AppliedJobDetailsPage({
  params,
}: {
  params: { jobId: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobDetailsContent jobId={params.jobId} />
    </Suspense>
  )
}

function JobDetailsContent({ jobId }: { jobId: string }) {
  const job = appliedJobs.find((j) => j.id === jobId)

  if (!job) {
    notFound()
  }

  // Mock candidate skills - Replace with actual data from user profile
  const candidateSkills = ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS']

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Back Link */}
      <Link
        href="/candidate/dashboard/applied"
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applied Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <JobHeader 
            job={job}
            showActions={false}
          />
          
          <JobTabs job={job} />
          
          <SkillsRecommendation 
            jobSkills={[...job.skills]}    
            candidateSkills={candidateSkills}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <JobOverview 
            job={job}
            showApplyButton={false} 
          />
          
          <JobBenefits benefits={job.benefits} />
        </div>
      </div>
    </div>
  )
}