"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Mail, Phone, MapPin, Building2, Calendar, Download } from "lucide-react"
import { CandidateJobFit } from "@/components/recruiter/candidates/candidate-job-fit"
// import { CandidateTimeline } from "@/components/recruiter/candidates/candidate-timeline"
// import { CandidateDocuments } from "@/components/recruiter/candidates/candidate-documents"
// import { StageUpdateDialog } from "@/components/recruiter/candidates/stage-update-dialog"
import { MessageDialog } from "@/components/recruiter/candidates/message-dialog"
import { InterviewDialog } from "@/components/recruiter/candidates/interview-dialog"

// Mock data - Replace with actual API call
const candidate = {
  id: "1",
  name: "Cameron Williamson",
  avatar: "https://i.pravatar.cc/150?u=1",
  email: "cameron.w@example.com",
  phone: "+1 (555) 000-0000",
  location: "New York, USA",
  experience: "5 years",
  currentRole: "Senior Frontend Developer",
  company: "Tech Corp",
  appliedDate: "2024-03-01",
  jobFitScore: 4.9,
  stage: "shortlist",
  skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
  education: "BS in Computer Science",
  summary: "Experienced frontend developer with a strong background in building scalable web applications...",
}

export default function CandidateProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const [showStageDialog, setShowStageDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-6">
        <Link
          href="/recruiter/candidates"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={candidate.avatar}
              alt={candidate.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{candidate.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{candidate.currentRole} at {candidate.company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowMessageDialog(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" onClick={() => setShowInterviewDialog(true)}>
              Schedule Interview
            </Button>
            <Button onClick={() => setShowStageDialog(true)}>
              Update Stage
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Tabs defaultValue="fit" className="space-y-4">
              <TabsList>
                <TabsTrigger value="fit">Job Fit</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="fit">
                <CandidateJobFit candidate={candidate} />
              </TabsContent>

              {/* <TabsContent value="timeline">
                <CandidateTimeline candidate={candidate} />
              </TabsContent>

              <TabsContent value="documents">
                <CandidateDocuments candidate={candidate} />
              </TabsContent> */}
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Candidate Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">Job Fit Score</span>
                </div>
                <span className="text-lg font-semibold">{candidate.jobFitScore}/5.0</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{candidate.location}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{candidate.email}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{candidate.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Applied on {candidate.appliedDate}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Education</h3>
              <p className="text-muted-foreground">{candidate.education}</p>
            </div>
          </Card>
        </div>
      </div>
{/* 
      <StageUpdateDialog
        open={showStageDialog}
        onOpenChange={setShowStageDialog}
        currentStage={candidate.stage}
      /> */}

      <MessageDialog
        open={showMessageDialog}
        onOpenChange={setShowMessageDialog}
        candidate={candidate}
      />

      <InterviewDialog
        open={showInterviewDialog}
        onOpenChange={setShowInterviewDialog}
        candidate={candidate}
      />
    </div>
  )
}