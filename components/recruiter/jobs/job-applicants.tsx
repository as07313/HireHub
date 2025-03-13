// components/recruiter/jobs/job-applicants.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { JobApplicant } from "@/app/types/applicant"

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

// components/recruiter/jobs/job-applicants.tsx
export function JobApplicants({ jobId, initialApplicants }: JobApplicantsProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [applicants] = useState<JobApplicant[]>(initialApplicants)

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = 
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || applicant.stage === stageFilter
    return matchesSearch && matchesStage
  })

  return (
    <div className="space-y-6">
      {/* Filters section */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
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
          {filteredApplicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image
                    src={applicant.avatar}
                    alt={applicant.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {applicant.experience}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{applicant.jobFitScore}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={stageStyles[applicant.stage]}
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
    </div>
  )
}