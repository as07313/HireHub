"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Circle } from "lucide-react"

interface ApplicantTimelineProps {
  applicant: any
}

const timeline = [
  {
    date: "Mar 15, 2024",
    title: "Application Submitted",
    description: "Candidate applied for Senior Frontend Developer position",
    type: "application",
  },
  {
    date: "Mar 16, 2024",
    title: "Resume Screened",
    description: "Application reviewed by hiring team",
    type: "screening",
  },
  {
    date: "Mar 18, 2024",
    title: "Shortlisted",
    description: "Candidate moved to shortlist stage",
    type: "stage",
  },
  {
    date: "Mar 20, 2024",
    title: "Technical Assessment Sent",
    description: "Coding challenge sent to candidate",
    type: "assessment",
  },
]

const typeStyles = {
  application: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  stage: "bg-green-100 text-green-800",
  assessment: "bg-yellow-100 text-yellow-800",
  interview: "bg-indigo-100 text-indigo-800",
}

export function ApplicantTimeline({ applicant }: ApplicantTimelineProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Application Timeline</h2>
        <p className="text-muted-foreground">
          Track the candidate&apos;s application progress
        </p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {timeline.map((event, index) => (
          <div key={index} className="relative flex items-center">
            <Circle className="relative z-10 h-2.5 w-2.5 translate-x-1/2 bg-white" />
            <Card className="ml-8 w-full p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    variant="secondary"
                    className={typeStyles[event.type as keyof typeof typeStyles]}
                  >
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <h3 className="mt-2 font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
                <time className="text-sm text-muted-foreground">{event.date}</time>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}