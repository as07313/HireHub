"use client"

import { useState } from "react"
import { JobsList } from "@/components/recruiter/jobs/jobs-list"
import { JobsHeader } from "@/components/recruiter/jobs/jobs-header"
import { JobsFilter } from "@/components/recruiter/jobs/jobs-filter"
import { JobsStats } from "@/components/recruiter/jobs/jobs-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

// Define the Job interface
export interface Job {
  id: string;
  recruiterId: string;
  title: string;
  department: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  status: string;
  salary: {
    min: string;
    max: string;
  };
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  applicantStats: {
    total: number;
    qualified: number;
  };
}

interface JobsClientProps {
  initialJobs: Job[];
}

export default function JobsClient({ initialJobs }: JobsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewType, setViewType] = useState("list")
  
  // Calculate stats when jobs are loaded
  const jobStats = {
    total: initialJobs.length,
    active: initialJobs.filter(job => job.status === "active").length,
    closed: initialJobs.filter(job => job.status === "closed").length,
    totalApplicants: initialJobs.reduce((sum, job) => sum + job.applicantStats.total, 0)
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
              jobs={initialJobs}
              searchQuery={searchQuery} 
              statusFilter={statusFilter}
              viewType={viewType}
            />
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <JobsList 
              jobs={initialJobs.filter(job => job.status === "active")}
              searchQuery={searchQuery} 
              statusFilter={"active"}
              viewType={viewType}
            />
          </TabsContent>  
          <TabsContent value="closed" className="mt-0">
            <JobsList 
              jobs={initialJobs.filter(job => job.status === "closed")}
              searchQuery={searchQuery} 
              statusFilter={"closed"}
              viewType={viewType}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}