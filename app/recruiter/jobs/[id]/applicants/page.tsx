"use client"

import { useState } from "react"
import { ApplicantsList } from "@/components/recruiter/jobs/applicants-list"
import { ApplicantsHeader } from "@/components/recruiter/jobs/applicants-header"
import { ApplicantsFilter } from "@/components/recruiter/jobs/applicants-filter"
import { ApplicantsStats } from "@/components/recruiter/jobs/applicants-stats"

export default function JobApplicantsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [hasRunRanking, setHasRunRanking] = useState(false)

  const handleRunRanking = () => {
    setHasRunRanking(true)
  }

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <ApplicantsHeader 
        jobId={params.id}
        onRunRanking={handleRunRanking}
        hasRunRanking={hasRunRanking}
      />
      <ApplicantsStats />
      <ApplicantsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
      />
      <ApplicantsList
        jobId={params.id}
        searchQuery={searchQuery}
        stageFilter={stageFilter}
        hasRunRanking={hasRunRanking}
      />
    </div>
  )
}