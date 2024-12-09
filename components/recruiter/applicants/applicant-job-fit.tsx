"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, CheckCircle, XCircle } from "lucide-react"

interface ApplicantJobFitProps {
  applicant: any
}

const fitCriteria = [
  {
    category: "Technical Skills",
    score: 95,
    matches: [
      { skill: "React", match: true },
      { skill: "TypeScript", match: true },
      { skill: "Node.js", match: true },
      { skill: "Python", match: false },
    ],
  },
  {
    category: "Experience",
    score: 85,
    matches: [
      { skill: "Years of Experience", match: true },
      { skill: "Similar Role", match: true },
      { skill: "Industry Experience", match: false },
    ],
  },
  {
    category: "Education",
    score: 90,
    matches: [
      { skill: "Degree Level", match: true },
      { skill: "Field of Study", match: true },
    ],
  },
  {
    category: "Location",
    score: 100,
    matches: [
      { skill: "Work Location", match: true },
      { skill: "Relocation", match: true },
    ],
  },
]

export function ApplicantJobFit({ applicant }: ApplicantJobFitProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Fit Analysis</h2>
          <p className="text-muted-foreground">
            AI-powered analysis of candidate&apos;s fit for this role
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-bold">{applicant.jobFitScore}</span>
          <span className="text-muted-foreground">/5.0</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fitCriteria.map((criteria) => (
          <Card key={criteria.category}>
            <CardHeader>
              <CardTitle className="text-lg">{criteria.category}</CardTitle>
              <CardDescription>Match Score: {criteria.score}%</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={criteria.score} className="mb-4" />
              <div className="space-y-2">
                {criteria.matches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{match.skill}</span>
                    {match.match ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>
            Key observations about the candidate&apos;s fit for this role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-primary/10 p-4">
            <h4 className="font-medium mb-2">Strengths</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Strong technical background in required technologies</li>
              <li>Relevant experience in similar roles</li>
              <li>Educational background aligns with position requirements</li>
              <li>Location preference matches job location</li>
            </ul>
          </div>

          <div className="rounded-lg bg-destructive/10 p-4">
            <h4 className="font-medium mb-2">Areas of Consideration</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Limited experience in specific industry</li>
              <li>Missing some preferred technical skills</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}