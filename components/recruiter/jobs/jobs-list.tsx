"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Users, Calendar, MapPin, DollarSign, BarChart } from "lucide-react"

interface JobsListProps {
  searchQuery: string
  statusFilter: string
}

// Mock data - Replace with actual API data
const jobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    salary: "$120k-150k/year",
    status: "active",
    applicants: 45,
    postedDate: "2024-03-15",
    applicantStats: {
      total: 45,
      qualified: 32,
      interviewing: 8,
      offered: 2
    }
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    salary: "$90k-120k/year",
    status: "active",
    applicants: 28,
    postedDate: "2024-03-14",
    applicantStats: {
      total: 28,
      qualified: 20,
      interviewing: 5,
      offered: 1
    }
  }
]

const statusStyles = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800"
}

export function JobsList({ searchQuery, statusFilter }: JobsListProps) {
  const router = useRouter()

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <Badge 
                    variant="secondary"
                    className={statusStyles[job.status as keyof typeof statusStyles]}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Posted {job.postedDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Applicants</p>
                    <p className="text-2xl font-semibold">{job.applicantStats.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Qualified</p>
                    <p className="text-2xl font-semibold">{job.applicantStats.qualified}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                className="w-full lg:w-auto"
                onClick={() => router.push(`/recruiter/jobs/${job.id}/applicants`)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Applicants
              </Button>
              <Button 
                variant="outline" 
                className="w-full lg:w-auto"
                onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
              >
                Edit Job
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}