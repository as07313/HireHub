// app/candidate/dashboard/find-jobs/[id]/page.tsx
import { Suspense } from "react"
import { JobDetailsClient } from "./job-details-client"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobDetailsClient jobId={id} />
    </Suspense>
  )
}