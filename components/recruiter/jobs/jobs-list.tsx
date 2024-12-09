"use client"

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

interface JobsListProps {
  searchQuery: string
  statusFilter: string
}

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full Time",
    status: "active",
    applicants: 45,
    postedDate: "2024-03-15",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full Time",
    status: "active",
    applicants: 32,
    postedDate: "2024-03-14",
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "San Francisco, CA",
    type: "Full Time",
    status: "closed",
    applicants: 28,
    postedDate: "2024-03-10",
  },
]

const statusStyles = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
}

export function JobsList({ searchQuery, statusFilter }: JobsListProps) {
  const router = useRouter()

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applicants</TableHead>
          <TableHead>Posted Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {job.department} • {job.location} • {job.type}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={statusStyles[job.status as keyof typeof statusStyles]}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{job.applicants} applicants</TableCell>
            <TableCell>{job.postedDate}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
                  >
                    Edit Job
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/recruiter/jobs/${job.id}/applicants`)}
                  >
                    View Applicants
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Close Job
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