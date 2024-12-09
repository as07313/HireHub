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
import { jobs } from "@/lib/data/jobs"
import { appliedJobs } from "@/lib/data/jobs"

interface JobListProps {
  searchQuery: string
  type: "all" | "applied" | "saved"
}

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

export function JobList({ searchQuery, type }: JobListProps) {
  const router = useRouter()
  const displayJobs = type === "applied" ? appliedJobs : jobs

  const filteredJobs = displayJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery?.toLowerCase() || "") ||
    job.company.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job</TableHead>
          <TableHead>{type === "applied" ? "Date Applied" : "Posted Date"}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-lg">
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
                  <div className="text-sm text-muted-foreground">
                    {job.location} • {job.salary}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              {type === "applied" ? job.appliedDate : job.postedDate}
            </TableCell>
            <TableCell>
              <Badge 
                variant="secondary" 
                className={
                  type === "applied" 
                    ? statusStyles[job.status]
                    : "bg-green-100 text-green-800"
                }
              >
                {type === "applied" 
                  ? statusLabels[job.status]
                  : "Active"
                }
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="link" 
                onClick={() => router.push(`/candidate/dashboard/${type === "applied" ? "applied" : "find-jobs"}/${job.id}`)}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}