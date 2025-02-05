// app/candidate/dashboard/find-jobs/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobList } from '@/components/candidate/dashboard/job-list'
import { Skeleton } from "@/components/ui/skeleton"
import { findJobs } from "@/app/actions/find-jobs"
import { BaseJob } from "@/app/types/job"

export default function FindJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<BaseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await findJobs()
        setJobs(fetchedJobs)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Transform jobs data to match JobList component interface
  const transformedJobs = jobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png',
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }))

  if (loading) {
    return (
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[450px]" />
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </Card>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Jobs</h1>
        <p className="text-muted-foreground">Discover your next opportunity</p>
      </div>

      <Card className="mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Job title, keyword, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            {/* <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent> */}
          </Select>
        </div>
      </Card>

      <JobList 
        jobs={transformedJobs}
        type="all"
        searchQuery={searchQuery}
        onViewDetails={(id) => router.push(`/candidate/dashboard/find-jobs/${id}`)}
        actionLabel="Apply"
        showStatus={false}
      />
    </div>
  )
}