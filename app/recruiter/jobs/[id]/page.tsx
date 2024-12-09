"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, MapPin, DollarSign, Building2, Calendar } from "lucide-react"
import { JobDetails } from "@/components/recruiter/jobs/job-details"
import { JobApplicants } from "@/components/recruiter/jobs/job-applicants"
import { JobInsights } from "@/components/recruiter/jobs/job-insights"

// Mock data - Replace with actual API call
const job = {
  id: "1",
  title: "Senior Frontend Developer",
  department: "Engineering",
  location: "Remote",
  type: "Full Time",
  status: "active",
  applicants: 156,
  postedDate: "2024-03-01",
  salary: "$120k-150k/year",
  description: "We are looking for a Senior Frontend Developer to join our team...",
  requirements: [
    "5+ years of experience with React",
    "Strong TypeScript skills",
    "Experience with state management",
  ],
  benefits: [
    "Competitive salary",
    "Remote work",
    "Health insurance",
    "401(k) matching",
  ],
}

export default function JobPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-6">
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted {job.postedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              {job.applicants} Applicants
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-600">
              Close Job
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="details">
              <JobDetails job={job} />
            </TabsContent>

            <TabsContent value="applicants">
              <JobApplicants jobId={params.id} />
            </TabsContent>

            <TabsContent value="insights">
              <JobInsights jobId={params.id} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}