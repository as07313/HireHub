// app/candidate/dashboard/applied/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { JobUI } from "@/app/types/job"

interface AppliedJob extends JobUI {
  status: 'active' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: string;
}

export default function AppliedJobsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobs, setJobs] = useState<AppliedJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await fetch('/api/applications/candidate')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        
        // Transform API data to match UI requirements
        const transformedJobs: AppliedJob[] = data.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.department,
          logo: '/company-placeholder.png',
          location: job.location,
          salary: `$${job.salary.min}-${job.salary.max}`,
          type: job.employmentType,
          postedDate: new Date(job.postedDate).toLocaleDateString(),
          status: job.status,
          appliedDate: new Date(job.appliedDate).toLocaleDateString()
        }))

        setJobs(transformedJobs)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (jobId: string) => {
    router.push(`/candidate/dashboard/applied/${jobId}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Rest of your JSX remains the same */}
      <JobList 
        jobs={filteredJobs}
        type="applied"
        searchQuery={searchQuery}
        onViewDetails={handleViewDetails}
        showStatus={true}
      />
    </div>
  )
}