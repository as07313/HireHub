// components/recruiter/jobs/jobs-stats.tsx
"use client"
import { Card } from "@/components/ui/card"
import { Briefcase, Users, CheckCircle, Clock } from "lucide-react"

interface JobsStatsProps {
    stats: {
      total: number;
      active: number;
      closed: number;
      totalApplicants: number;
    }
  }
export function JobsStats({ stats }: JobsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-l-green-500">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-l-yellow-500">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Closed Jobs</p>
            <p className="text-2xl font-bold">{stats.closed}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-100 rounded-full">
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Applicants</p>
            <p className="text-2xl font-bold">{stats.totalApplicants}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}