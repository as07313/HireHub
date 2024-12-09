"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Clock, Building2 } from "lucide-react"
import { jobs } from "@/lib/data/jobs"

interface JobSearchListProps {
  searchQuery: string
  location: string
  category: string
}

export function JobSearchList({ searchQuery, location, category }: JobSearchListProps) {
  const router = useRouter()

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = location
      ? job.location.toLowerCase().includes(location.toLowerCase())
      : true
    const matchesCategory = category ? job.department.toLowerCase() === category : true
    return matchesSearch && matchesLocation && matchesCategory
  })

  return (
    <div className="grid gap-4">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-lg border bg-white p-2">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.postedDate}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {job.employmentType}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {job.experience}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push(`/dashboard/find-jobs/${job.id}`)}>
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}