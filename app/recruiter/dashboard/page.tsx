import connectToDatabase from '@/lib/mongodb'
import Job from '@/models/Job'
import { Card } from "@/components/ui/card"
import { RecruiterStats } from "@/components/recruiter/dashboard/recruiter-stats"
import { ApplicationChart } from "@/components/recruiter/dashboard/application-chart"
import { RecentJobs } from "@/components/recruiter/dashboard/recent-jobs"
import { DemographicsChart } from "@/components/recruiter/dashboard/demographics-chart"

async function fetchJobs() {
  await connectToDatabase()
  const jobs = await Job.find({}).lean()
  return JSON.parse(JSON.stringify(jobs))
}

export default async function RecruiterDashboardPage() {
  const jobs = await fetchJobs()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your recruitment metrics and activities</p>
        </div>
      </div>

      <RecruiterStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Application Statistics</h2>
          <ApplicationChart />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Demographics</h2>
          <DemographicsChart />
        </Card>
      </div>

      <RecentJobs jobs={jobs} />
    </div>
  )
}