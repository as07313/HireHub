"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, Banknote, GraduationCap } from "lucide-react"
import { JobApplicationDialog } from "@/components/candidate/jobs/job-application-dialog"

interface JobOverviewProps {
  job: {
    experience: string
    salary: string
    education: string
  }
  showApplyButton?: boolean
}

export function JobOverview({ job, showApplyButton = false }: JobOverviewProps) {
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  return (
    <>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BriefcaseIcon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium">{job.experience}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Banknote className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Salary</p>
              <p className="font-medium">{job.salary}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Education</p>
              <p className="font-medium">{job.education}</p>
            </div>
          </div>
        </div>
        {showApplyButton && (
          <Button 
            className="w-full mt-6"
            onClick={() => setShowApplicationDialog(true)}
          >
            Apply Now
          </Button>
        )}
      </Card>

      <JobApplicationDialog 
        open={showApplicationDialog} 
        onOpenChange={setShowApplicationDialog}
      />
    </>
  )
}