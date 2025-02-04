// app/candidate/dashboard/page.tsx
import { Suspense } from "react"
import { DashboardClient } from "./dashboard-client"
import { auth } from "@/app/middleware/auth"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/app/actions/user"
import { getAppliedJobs } from "@/app/actions/applied-jobs"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/candidate/auth/login')
  }

  // Fetch user data server-side
  const [userData, appliedJobs] = await Promise.all([
    getUserProfile(session.userId),
    getAppliedJobs()
  ])

  // If no user data found, redirect to login
  if (!userData) {
    redirect('/candidate/auth/login')
  }

  // Now TypeScript knows userData is not null
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient initialData={userData}
      appliedJobs={appliedJobs}
       />
    </Suspense>
  )
}