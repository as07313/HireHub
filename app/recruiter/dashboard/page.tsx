// app/recruiter/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { 
  Users, 
  UserCheck, 
  UserCog, 
  UserPlus,
  TrendingUp,
  TrendingDown 
} from "lucide-react"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Chart options and data moved inline
const applicationChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
}

const demographicsChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs')
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Stats data - could be fetched from API
  const stats = [
    { label: 'Total Candidates', value: '2,456', icon: Users, trend: '+12%' },
    { label: 'Shortlisted', value: '456', icon: UserCheck, trend: '+5%' },
    { label: 'Interviews', value: '123', icon: UserCog, trend: '+8%' },
    { label: 'New Applications', value: '89', icon: UserPlus, trend: '+14%' }
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your recruitment metrics and activities</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Application Statistics</h2>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgb(99, 102, 241)',
                barThickness: 20,
                borderRadius: 4
              }]
            }}
            options={applicationChartOptions}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Demographics</h2>
          <Doughnut
            data={{
              labels: ['Male', 'Female', 'Other'],
              datasets: [{
                data: [45, 35, 20],
                backgroundColor: [
                  'rgb(99, 102, 241)',
                  'rgb(244, 63, 94)',
                  'rgb(234, 179, 8)'
                ]
              }]
            }}
            options={demographicsChartOptions}
          />
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
        </div>
        <div className="space-y-4">
          {jobs.slice(0, 5).map((job) => (
            <div key={job._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.department} • {job.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{job.applicants} Applicants</p>
                <p className="text-sm text-muted-foreground">
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}