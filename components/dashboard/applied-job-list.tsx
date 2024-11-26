"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Building2, MapPin, DollarSign } from "lucide-react"

interface AppliedJob {
  id: string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  type: string
  appliedDate: string
  status: "active" | "interviewing" | "offered" | "rejected"
  nextInterview?: string
}

const appliedJobs: AppliedJob[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    location: "Washington",
    salary: "$120k-150k/year",
    type: "Full Time",
    appliedDate: "2024-01-15T10:28:00Z",
    status: "interviewing",
    nextInterview: "2024-02-01T15:00:00Z",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2880px-Google_2015_logo.svg.png",
    location: "Remote",
    salary: "$100k-130k/year",
    type: "Full Time",
    appliedDate: "2024-01-10T23:28:00Z",
    status: "active",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    location: "California",
    salary: "$90k-120k/year",
    type: "Full Time",
    appliedDate: "2024-01-05T10:28:00Z",
    status: "offered",
  },
  {
    id: "4",
    title: "Software Engineer",
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
    location: "New York",
    salary: "$130k-160k/year",
    type: "Full Time",
    appliedDate: "2024-01-01T23:28:00Z",
    status: "rejected",
  },
]

const statusStyles = {
  active: "bg-blue-100 text-blue-800",
  interviewing: "bg-yellow-100 text-yellow-800",
  offered: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
}

const statusLabels = {
  active: "Under Review",
  interviewing: "Interviewing",
  offered: "Offer Received",
  rejected: "Not Selected",
}

interface AppliedJobsListProps {
  searchQuery: string
  statusFilter: string
}

export function AppliedJobsList({ searchQuery, statusFilter }: AppliedJobsListProps) {
  const router = useRouter()

  const filteredJobs = appliedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Details</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Steps</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-lg border bg-white p-1">
                    <Image
                      src={job.logo}
                      alt={job.company}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(job.appliedDate), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusStyles[job.status]}>
                  {statusLabels[job.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {job.status === "interviewing" && job.nextInterview ? (
                  <div className="text-sm">
                    Interview scheduled for{" "}
                    {formatDistanceToNow(new Date(job.nextInterview), {
                      addSuffix: true,
                    })}
                  </div>
                ) : job.status === "offered" ? (
                  <div className="text-sm text-green-600">
                    Review your offer letter
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No pending actions
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="link"
                  onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}