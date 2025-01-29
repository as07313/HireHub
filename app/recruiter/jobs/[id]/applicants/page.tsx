// app/recruiter/jobs/[id]/applicants/page.tsx
"use client"

import { useState } from "react"
import { ApplicantsList } from "@/components/recruiter/jobs/applicants-list"
import { ApplicantsHeader } from "@/components/recruiter/jobs/applicants-header"
import { ApplicantsFilter } from "@/components/recruiter/jobs/applicants-filter"
import { ApplicantsStats } from "@/components/recruiter/jobs/applicants-stats"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobApplicantsPage({ params }: PageProps) {
  // Await the params
  const { id } = await params
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [hasRunRanking, setHasRunRanking] = useState(false)

  const handleRunRanking = () => {
    setHasRunRanking(true)
  }

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <ApplicantsHeader 
        jobId={id}
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
        jobId={id}
        searchQuery={searchQuery}
        stageFilter={stageFilter}
        hasRunRanking={hasRunRanking}
      />
    </div>
  )
}