// app/recruiter/jobs/[id]/applicants/page.tsx
import { Suspense } from "react"
import { ApplicantsClient } from "./applicants-client"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobApplicantsPage({ params }: PageProps) {

  const { id } = await params

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Applicants</h1>
        <p className="text-muted-foreground">Review and manage candidates for this position</p>
      </div>

      <Suspense fallback={<div>Loading applicants...</div>}>
        <ApplicantsClient jobId={id} />
      </Suspense>
    </div>
  )
}