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

const jobs = [
  {
    id: 1,
    title: "Networking Engineer",
    company: "Microsoft",
    location: "Washington",
    salary: "$50k-80k/month",
    type: "Remote",
    date: "Feb 2, 2019 10:28",
    status: "Active",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Google",
    location: "Dhaka",
    salary: "$50k-60k/month",
    type: "Full Time",
    date: "Dec 7, 2019 23:28",
    status: "Active",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2880px-Google_2015_logo.svg.png",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    company: "Apple",
    location: "Brazil",
    salary: "$50k-60k/month",
    type: "Temporary",
    date: "Feb 2, 2019 10:28",
    status: "Active",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
  },
  {
    id: 4,
    title: "Visual Designer",
    company: "Microsoft",
    location: "Wisconsin",
    salary: "$50k-80k/month",
    type: "Contract Base",
    date: "Dec 7, 2019 23:28",
    status: "Active",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  },
]

export function JobList() {
  const router = useRouter()

  return (
    <div className="text-black">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job</TableHead>
          <TableHead>Date Applied</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
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
            <TableCell>{job.date}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {job.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="link" 
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                className="text-black"
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