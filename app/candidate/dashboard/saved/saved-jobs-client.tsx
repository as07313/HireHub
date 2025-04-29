"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { saveJob, removeSavedJob } from "@/app/actions/save-jobs"
import { toast } from "sonner"
import { BaseJob, JobUI } from "@/app/types/job"
import { motion } from "framer-motion"

interface SavedJobsClientProps {
  initialJobs: BaseJob[]
}

export function SavedJobsClient({ initialJobs }: SavedJobsClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [jobs, setJobs] = useState<JobUI[]>(initialJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png',
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString(),
    status: job.status,
    appliedDate: job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : undefined
  })))
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || 
      job.type.toLowerCase() === typeFilter
    return matchesSearch && matchesType
  })

  const handleRemoveJob = async (id: string) => {
    try {
      const result = await removeSavedJob(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      setJobs(prev => prev.filter(job => job.id !== id));
      toast.success("Job removed from saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove job");
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <motion.div
        className="mb-6" // Reduced mb-10
        initial={{ opacity: 0, y: 15 }} // Reduced y
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} // Reduced duration
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Saved Jobs</h1> {/* Updated heading */}
        <p className="text-base text-gray-600 max-w-xl"> {/* Updated description */}
          Review and manage the jobs you've saved.
        </p>
      </motion.div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No saved jobs found</p>
        </Card>
      ) : (
        <JobList 
          jobs={filteredJobs}
          type="saved"
          searchQuery={searchQuery}
          onViewDetails={(id) => router.push(`/candidate/dashboard/saved/${id}`)}
          onAction={handleRemoveJob}
          actionLabel="Remove"
          showStatus={false}
        />
      )}
    </div>
  );

}











