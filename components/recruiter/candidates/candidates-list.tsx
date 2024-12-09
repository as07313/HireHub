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

interface CandidatesListProps {
  searchQuery: string
  statusFilter: string
}

const candidates = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://i.pravatar.cc/150?u=1",
    email: "john.smith@example.com",
    jobFitScore: 4.8,
    status: "reviewing",
    appliedDate: "2024-03-15",
    experience: "5 years",
    location: "New York, USA",
    currentRole: "Senior Frontend Developer",
    company: "Tech Corp",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=2",
    email: "sarah.j@example.com",
    jobFitScore: 4.5,
    status: "shortlisted",
    appliedDate: "2024-03-14",
    experience: "4 years",
    location: "Remote",
    currentRole: "UX Designer",
    company: "Design Studio",
  },
]

const statusStyles = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
}

export function CandidatesList({ searchQuery, statusFilter }: CandidatesListProps) {
  const router = useRouter()

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Job Fit Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCandidates.map((candidate) => (
          <TableRow key={candidate.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Image
                  src={candidate.avatar}
                  alt={candidate.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.currentRole} at {candidate.company}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{candidate.jobFitScore}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={statusStyles[candidate.status as keyof typeof statusStyles]}
              >
                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{candidate.appliedDate}</TableCell>
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