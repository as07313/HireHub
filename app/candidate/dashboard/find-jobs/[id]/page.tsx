// app/candidate/dashboard/find-jobs/[id]/page.tsx
import { Suspense } from "react"
import { JobDetailsClient } from "./job-details-client"
import { findJobById } from "@/app/actions/find-jobs"
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
  const job = await findJobById(id)

  if (!job) {
    return notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobDetailsClient jobId={id} initialJob={job} />
    </Suspense>
  )
}