"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star, UserCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { JobApplicant } from "@/app/types/applicant"
import { RankingButton } from "@/components/recruiter/jobs/ranking-button"
import { RankingProgress } from "@/components/recruiter/jobs/ranking-progress"
import { Card } from "@/components/ui/card"

interface JobApplicantsProps {
  jobId: string
  initialApplicants: JobApplicant[]
}

const stageStyles = {
  new: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  shortlist: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

export function JobApplicants({ jobId, initialApplicants }: JobApplicantsProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [applicants, setApplicants] = useState<JobApplicant[]>(initialApplicants)
  const [isRanking, setIsRanking] = useState(false)
  const [hasRankingResults, setHasRankingResults] = useState(false)

  // Check if we already have ranking results
  useEffect(() => {
    // If any applicant has a job fit score, we have ranking results
    const hasScores = initialApplicants.some(app => app.jobFitScore > 0)
    setHasRankingResults(hasScores)
  }, [initialApplicants])

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || applicant.stage === stageFilter
    return matchesSearch && matchesStage
  })

  // Sort applicants by job fit score when ranking is done
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (hasRankingResults) {
      return b.jobFitScore - a.jobFitScore
    }
    // Default sort by applied date (most recent first)
    return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  })

  const handleRankingStart = () => {
    setIsRanking(true)
  }

  const handleRankingComplete = async () => {
    setIsRanking(false)
    setHasRankingResults(true)
    
    // Refresh applicants data to get updated scores
    try {
      const response = await fetch(`/api/jobs/${jobId}/applicants`)
      if (response.ok) {
        const updatedApplicants = await response.json()
        setApplicants(updatedApplicants)
      }
    } catch (error) {
      console.error('Error refreshing applicants:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ranking section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {initialApplicants.length} Applicants
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasRankingResults ? 'Applicants ranked by job fit score' : 'Manage candidates for this position'}
          </p>
        </div>
        
        <RankingButton
          jobId={jobId}
          onRankingStart={handleRankingStart}
          onRankingComplete={handleRankingComplete}
          hasRankingResults={hasRankingResults}
          disabled={initialApplicants.length === 0}
        />
      </div>

      {/* Show ranking progress when ranking is in progress */}
      {isRanking && (
        <RankingProgress jobId={jobId} />
      )}

      {/* Filters section */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-w-sm"
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="shortlist">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Job Fit</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.experience}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {hasRankingResults ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{applicant.jobFitScore}%</span>
                    </div>
                    {applicant.aiAnalysis && (
                      <div className="text-xs text-muted-foreground">
                        Technical: {applicant.aiAnalysis.technicalSkills.score}% • Experience: {applicant.aiAnalysis.experience.score}%
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not ranked</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={stageStyles[applicant.stage as keyof typeof stageStyles]}
                >
                  {applicant.stage.charAt(0).toUpperCase() + applicant.stage.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  onClick={() => router.push(`/recruiter/jobs/${jobId}/applicants/${applicant.id}`)}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty state */}
      {sortedApplicants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No applicants found matching your filters</p>
        </div>
      )}
    </div>
  )
}