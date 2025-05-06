"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { BaseJob, JobUI } from "@/app/types/job"
import { motion } from "framer-motion"

interface AppliedJobsClientProps {
  initialJobs: BaseJob[]
}

// Define possible application statuses based on Applicant model (#models\Applicant.ts:12)
const applicationStatuses = [
  { value: 'new', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'shortlist', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Not Selected' },
];

export function AppliedJobsClient({ initialJobs }: AppliedJobsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Filter based on application status

  // Transform BaseJob to JobUI, using applicationStatus for the status field
  const jobs: JobUI[] = initialJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png', // Placeholder logo
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString(),
    // *** Use applicationStatus for the 'status' field in this context ***
    status: job.applicationStatus, // <-- Map applicationStatus here
    appliedDate: job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : undefined
  }))

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter using the application status now present in job.status
    const matchesStatus = statusFilter === "all" || job.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container max-w-6xl py-8">
       <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">My Applications</h1>
        <p className="text-base text-gray-600 max-w-xl">
          Track the status of your job applications.
        </p>
      </motion.div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applied jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {/* Filter dropdown using application statuses */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              {applicationStatuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
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