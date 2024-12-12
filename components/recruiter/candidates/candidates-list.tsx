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
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CandidatesListProps {
  searchQuery: string
  statusFilter: string
}

// Mock data - Replace with actual API data
const candidates = [
  {
    id: "C001",
    name: "John Smith",
    stage: "screening",
    jobId: "J001",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2024-03-15",
    currentRole: "Frontend Developer",
    company: "Tech Corp"
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    stage: "interview",
    jobId: "J002",
    jobTitle: "UX Designer",
    appliedDate: "2024-03-14",
    currentRole: "Product Designer",
    company: "Design Studio"
  },
  {
    id: "C003",
    name: "Michael Brown",
    stage: "offer",
    jobId: "J003",
    jobTitle: "Backend Developer",
    appliedDate: "2024-03-13",
    currentRole: "Backend Developer",
    company: "Web Solutions"
  },
  {
    id: "C004",
    name: "Emily Davis",
    stage: "hired",
    jobId: "J004",
    jobTitle: "Project Manager",
    appliedDate: "2024-03-12",
    currentRole: "Project Coordinator",
    company: "Management Inc."
  },
  {
    id: "C005",
    name: "David Wilson",
    stage: "rejected",
    jobId: "J005",
    jobTitle: "Data Scientist",
    appliedDate: "2024-03-11",
    currentRole: "Data Analyst",
    company: "Data Insights"
  },
  {
    id: "C006",
    name: "Jessica Martinez",
    stage: "new",
    jobId: "J006",
    jobTitle: "Marketing Specialist",
    appliedDate: "2024-03-10",
    currentRole: "Marketing Coordinator",
    company: "Marketing Solutions"
  },
  {
    id: "C007",
    name: "Daniel Anderson",
    stage: "screening",
    jobId: "J007",
    jobTitle: "DevOps Engineer",
    appliedDate: "2024-03-09",
    currentRole: "System Administrator",
    company: "Cloud Services"
  },
  {
    id: "C008",
    name: "Laura Thomas",
    stage: "interview",
    jobId: "J008",
    jobTitle: "Product Manager",
    appliedDate: "2024-03-08",
    currentRole: "Product Owner",
    company: "Product Hub"
  },
  {
    id: "C009",
    name: "James Taylor",
    stage: "offer",
    jobId: "J009",
    jobTitle: "Full Stack Developer",
    appliedDate: "2024-03-07",
    currentRole: "Software Engineer",
    company: "Tech Innovations"
  },
  {
    id: "C010",
    name: "Olivia Lee",
    stage: "hired",
    jobId: "J010",
    jobTitle: "HR Manager",
    appliedDate: "2024-03-06",
    currentRole: "HR Specialist",
    company: "People Solutions"
  }
]
const stageStyles = {
  new: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800"
}

export function CandidatesList({ searchQuery, statusFilter }: CandidatesListProps) {
  const router = useRouter()

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.stage === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant ID</TableHead>
          <TableHead>Applicant Name</TableHead>
          <TableHead>Job ID</TableHead>
          <TableHead>Job Position</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCandidates.map((candidate) => (
          <TableRow key={candidate.id}>
              <TableCell>
              <span className="font-mono text-sm">{candidate.id}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.currentRole} at {candidate.company}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="font-mono text-sm">{candidate.jobId}</span>
            </TableCell>
            <TableCell>{candidate.jobTitle}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={stageStyles[candidate.stage as keyof typeof stageStyles]}
              >
                {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/recruiter/candidates/${candidate.id}`)}
                  >
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Remove Candidate
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