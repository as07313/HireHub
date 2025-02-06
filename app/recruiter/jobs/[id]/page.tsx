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
import { JobDetailsClient } from "./jobs-detail-client"

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

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Mock data stays the same...
export default async function JobPage({ params }: PageProps) {
  // Await the params
  const { id } = await params

  return (
    <JobDetailsClient job={job} />
  )
}