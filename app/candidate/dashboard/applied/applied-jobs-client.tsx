// app/candidate/dashboard/applied/applied-jobs-client.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { BaseJob } from "@/app/types/job"
import { JobUI } from "@/app/types/job"

interface AppliedJobsClientProps {
  initialJobs: BaseJob[]
}

export function AppliedJobsClient({ initialJobs }: AppliedJobsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Transform BaseJob to JobUI
  const jobs = initialJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png',
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString(),
    status: job.status,
    appliedDate: new Date(job.appliedDate).toLocaleDateString()
  }))

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container max-w-6xl py-8">
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applied jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <JobList 
        jobs={filteredJobs}
        type="applied"
        searchQuery={searchQuery}
        onViewDetails={(id) => router.push(`/candidate/dashboard/applied/${id}`)}
        showStatus={true}
      />
    </div>
  )
}