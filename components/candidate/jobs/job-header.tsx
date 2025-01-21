// components/candidate/jobs/job-header.tsx
"use client"

import Image from "next/image"
import { Building2, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, BookmarkPlus, BookmarkX } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { useState } from "react"

interface JobHeaderProps {
  job: {
    id: string
    logo: string
    company: string
    title: string
    location: string
    postedDate: string
    employmentType: string
    workplaceType: string
    experience: string
  }
  showActions?: boolean
}

export function JobHeader({ job, showActions = true }: JobHeaderProps) {
  const { savedJobs, saveJob, removeJob } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await removeJob(job.id);
      } else {
        await saveJob(job.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 overflow-hidden rounded-xl border bg-white p-2">
          <Image
            src={job.logo}
            alt={job.company}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedDate}
                </div>
              </div>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleToggleSave}
                  disabled={isSaving}
                >
                  {isSaved ? (
                    <BookmarkX className="h-4 w-4 text-red-500" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {job.employmentType}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {job.workplaceType}
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {job.experience}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}