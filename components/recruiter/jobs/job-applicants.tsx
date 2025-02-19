"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Star } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface JobApplicant {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  skills: string[]
  experience: string
  stage: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected'
  jobFitScore: number
  appliedDate: string
  location: string
  currentRole?: string
  company?: string
  interviews?: Array<{
    scheduledDate: Date
    type: 'technical' | 'hr' | 'cultural' | 'final'
    status: 'scheduled' | 'completed' | 'cancelled'
    feedback?: string
  }>
}

interface JobApplicantsProps {
  jobId: string
  initialApplicants: JobApplicant[]
}

const applicants = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://i.pravatar.cc/150?u=1",
    jobFitScore: 4.8,
    stage: "shortlisted",
    appliedDate: "2024-03-15",
    experience: "5 years",
    location: "New York, USA",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=2",
    jobFitScore: 4.5,
    stage: "interview",
    appliedDate: "2024-03-14",
    experience: "4 years",
    location: "Remote",
  },
  // Add more applicants as needed
]

const stageStyles = {
  new: "bg-blue-100 text-blue-800",
  shortlisted: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

export function JobApplicants({ jobId, initialApplicants }: JobApplicantsProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [applicants] = useState(initialApplicants)

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = applicant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || applicant.stage === stageFilter
    return matchesSearch && matchesStage
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Job Fit Score</TableHead>
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
                      {applicant.experience} • {applicant.location}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{applicant.jobFitScore}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    stageStyles[applicant.stage as keyof typeof stageStyles]
                  }
                >
                  {applicant.stage.charAt(0).toUpperCase() +
                    applicant.stage.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{applicant.appliedDate}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  onClick={() =>
                    router.push(
                      `/recruiter/jobs/${jobId}/applicants/${applicant.id}`
                    )
                  }
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