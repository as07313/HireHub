"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ApplicantsHeaderProps {
  jobId: string
  onRunRanking: () => void
  hasRunRanking: boolean
}

export function ApplicantsHeader({ jobId, onRunRanking, hasRunRanking }: ApplicantsHeaderProps) {
  const handleRunRanking = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Running applicant ranking...',
        success: () => {
          onRunRanking()
          return 'Applicant ranking completed!'
        },
        error: 'Failed to run ranking',
      }
    )
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold">Job Applicants</h1>
        <p className="text-muted-foreground">
          Review and manage candidates for this position
        </p>
      </div>

      <Button
        size="lg"
        onClick={handleRunRanking}
        disabled={hasRunRanking}
      >
        {hasRunRanking ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Ranking Complete
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Run Job Fit Ranking
          </>
        )}
      </Button>
    </div>
  )
}