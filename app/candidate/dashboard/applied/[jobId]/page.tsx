// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation"
import { appliedJobs } from '@/lib/data/applied-jobs'

interface PageProps {
  params: Promise<{
    jobId: string
  }>
}

// Generate static params for static site generation
export async function generateStaticParams() {
  return appliedJobs.map((job) => ({
    jobId: job.id,
  }))
}

export default async function AppliedJobDetailsPage({
  params,
}: PageProps) {
  const { jobId } = await params

  return (
    <div className="container max-w-6xl py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <JobDetailsContent jobId={jobId} />
      </Suspense>
    </div>
  )
}

function JobDetailsContent({ jobId }: { jobId: string }) {
  const job = appliedJobs.find((j) => j.id === jobId)

  if (!job) {
    notFound()
  }

  const candidateSkills = ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'] as const

  return (
    <div>
      <Link
        href="/candidate/dashboard/applied"
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applied Jobs
      </Link>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SkillsRecommendation 
            jobSkills={job.skills}    
            candidateSkills={candidateSkills}
          />
        </div>
      </div>
    </div>
  )
}