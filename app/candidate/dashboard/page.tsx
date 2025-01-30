import { Suspense } from "react"
import { DashboardClient } from "./dashboard-client"
import { auth } from "@/app/middleware/auth"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/app/actions/user"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/candidate/auth/login')
  }

  // Fetch user data server-side
  const userData = await getUserProfile(session.userId)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClient initialData={userData} />
    </Suspense>
  )
}