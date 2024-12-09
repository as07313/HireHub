"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ApplicantsListProps {
  jobId: string
  searchQuery: string
  stageFilter: string
  sortBy: string
}

const applicants = [
  {
    id: "1",
    name: "Cameron Williamson",
    avatar: "https://i.pravatar.cc/150?u=1",
    email: "cameron.w@example.com",
    jobFitScore: 4.9,
    stage: "shortlist",
    appliedDate: "2024-03-01",
    experience: "5 years",
    location: "New York, USA",
  },
  {
    id: "2",
    name: "Savannah Nguyen",
    avatar: "https://i.pravatar.cc/150?u=2",
    email: "savannah.n@example.com",
    jobFitScore: 4.7,
    stage: "interview",
    appliedDate: "2024-03-02",
    experience: "4 years",
    location: "San Francisco, USA",
  },
  // Add more applicants as needed
]

const stageStyles = {
  new: "bg-blue-100 text-blue-800",
  shortlist: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

export function ApplicantsList({
  jobId,
  searchQuery,
  stageFilter,
  sortBy,
}: ApplicantsListProps) {
  const router = useRouter()

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === "all" || applicant.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.jobFitScore - a.jobFitScore
      case "recent":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
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
        {sortedApplicants.map((applicant) => (
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
                className={stageStyles[applicant.stage as keyof typeof stageStyles]}
              >
                {applicant.stage.charAt(0).toUpperCase() + applicant.stage.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{applicant.appliedDate}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/recruiter/jobs/${jobId}/applicants/${applicant.id}`)
                    }
                  >
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Move to Interview</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Reject Application
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}