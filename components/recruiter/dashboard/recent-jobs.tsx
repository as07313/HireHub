"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

interface Job {
  _id: string;
  title: string;
  type: string;
  timeLeft: string;
  status: string;
  applications: number;
}

interface RecentJobsProps {
  jobs: Job[];
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">Recently Posted Jobs</h2>
        <Button variant="outline">View All Jobs</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jobs</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.type} • {job.timeLeft}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>{job.applications} applications</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}