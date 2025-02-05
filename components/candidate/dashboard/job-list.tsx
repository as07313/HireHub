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
import { Building2, MapPin, DollarSign, Clock } from "lucide-react"
import { JobUI } from "@/app/types/job"


interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  type: string
  postedDate: string
  status?: string
  appliedDate?: string
  savedDate?: string
}

interface JobListProps {
  jobs: JobUI[]
  type: "all" | "applied" | "saved"
  searchQuery?: string
  onViewDetails: (jobId: string) => void
  onAction?: (jobId: string) => void
  actionLabel?: string
  showStatus?: boolean
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

export function JobList({
  jobs = [], // Provide default empty array
  type,
  searchQuery = "",
  onViewDetails,
  onAction,
  actionLabel,
  showStatus = true,
}: JobListProps) {
  // Add type guard to ensure jobs is an array
  const jobsArray = Array.isArray(jobs) ? jobs : []
  console.log(jobsArray)

  // const filteredJobs = jobsArray.filter((job) =>
  //   job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   job.company.toLowerCase().includes(searchQuery.toLowerCase())
  // )

  const getDateColumn = (job: Job) => {
    switch (type) {
      case "applied":
        return job.appliedDate
      case "saved":
        return job.savedDate
      default:
        return job.postedDate
    }
  }

  const getDateColumnLabel = () => {
    switch (type) {
      case "applied":
        return "Date Applied"
      case "saved":
        return "Date Saved"
      default:
        return "Posted Date"
    }
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job</TableHead>
          <TableHead>{getDateColumnLabel()}</TableHead>
          {showStatus && <TableHead>Status</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobsArray.map((job) => (
          <TableRow key={job.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 overflow-hidden rounded-lg border bg-white p-1">
                  {/* <Image
                    src={job.logo}
                    alt={job.company}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  /> */}
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
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getDateColumn(job)}
              </span>
            </TableCell>
            {showStatus && (
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={job.status ? statusStyles[job.status as keyof typeof statusStyles] : ""}
                >
                  {job.status ? statusLabels[job.status as keyof typeof statusLabels] : "Active"}
                </Badge>
              </TableCell>
            )}
            <TableCell className="text-right space-x-2">
              <Button variant="link" onClick={() => onViewDetails(job.id)}>
                View Details
              </Button>
              {onAction && (
                <Button variant="outline" onClick={() => onAction(job.id)}>
                  {actionLabel}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}