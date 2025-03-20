// app/recruiter/jobs/page.tsx
"use client"

import { useState, useEffect } from "react"
import { JobsList } from "@/components/recruiter/jobs/jobs-list"
import { JobsHeader } from "@/components/recruiter/jobs/jobs-header"
import { JobsFilter } from "@/components/recruiter/jobs/jobs-filter"
import { JobsStats } from "@/components/recruiter/jobs/jobs-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useJobs } from "@/hooks/use-job"
import { Loader2 } from "lucide-react"

export default function RecruiterJobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewType, setViewType] = useState("list")
  const { jobs, loading } = useJobs()

  // Analytics data
  const [jobStats, setJobStats] = useState({
    total: 0,
    active: 0,
    closed: 0,
    totalApplicants: 0
  })

  // Calculate stats when jobs are loaded
  useEffect(() => {
    if (!jobs) return
    
    const stats = {
      total: jobs.length,
      active: jobs.filter(job => job.status === "active").length,
      closed: jobs.filter(job => job.status === "closed").length,
      totalApplicants: jobs.reduce((sum, job) => sum + job.applicantStats.total, 0)
    }
    
    setJobStats(stats)
  }, [jobs])

  if (loading) {
    return (
      <div className="container max-w-7xl py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading job listings...</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-7xl py-8 space-y-8"
    >
      <JobsHeader />
      
      {/* Stats Overview */}
      <JobsStats stats={jobStats} />
      
      <Card className="p-6">
        <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value)} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Jobs ({jobStats.total})</TabsTrigger>
              <TabsTrigger value="active">Active ({jobStats.active})</TabsTrigger>
              <TabsTrigger value="closed">Closed ({jobStats.closed})</TabsTrigger>
            </TabsList>
            
            <JobsFilter 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewType={viewType}
              onViewChange={setViewType}
            />
          </div>

          <TabsContent value="all" className="mt-0">
            <JobsList 
              searchQuery={searchQuery} 
              statusFilter={statusFilter}
              viewType={viewType}
            />
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <JobsList 
              searchQuery={searchQuery} 
              statusFilter="active"
              viewType={viewType}
            />
          </TabsContent>  
          <TabsContent value="closed" className="mt-0">
            <JobsList 
              searchQuery={searchQuery} 
              statusFilter="closed"
              viewType={viewType}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}