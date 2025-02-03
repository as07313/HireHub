// app/candidate/dashboard/applied/page.tsx
import { Suspense } from "react"
import { AppliedJobsClient } from "./applied-jobs-client"
import { getAppliedJobs } from "@/app/actions/applied-jobs"
import { auth } from "@/app/middleware/auth"
import { redirect } from "next/navigation"

export default async function AppliedJobsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/candidate/auth/login')
  }

  // Fetch applied jobs server-side
  const jobs = await getAppliedJobs()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppliedJobsClient initialJobs={jobs} />
    </Suspense>
  )
}