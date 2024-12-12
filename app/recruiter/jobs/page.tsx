"use client"

import { useState } from "react"
import { JobsList } from "@/components/recruiter/jobs/jobs-list"
import { JobsHeader } from "@/components/recruiter/jobs/jobs-header"
import { JobsFilter } from "@/components/recruiter/jobs/jobs-filter"

export default function RecruiterJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <JobsHeader />
      <JobsFilter 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <JobsList 
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />
    </div>
  )
}