// app/recruiter/jobs/[id]/applicants/[applicantsId]/applicant-details-client.tsx
"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ApplicantProfile } from '@/components/recruiter/applicants/applicant-profile'
import { ApplicantActions } from '@/components/recruiter/applicants/applicant-actions'
import { ApplicantTimeline } from '@/components/recruiter/applicants/applicant-timeline'
import { ApplicantDocuments } from '@/components/recruiter/applicants/applicant-documents'
import { ApplicantAIAnalysis } from '@/components/recruiter/applicants/applicant-ai-analysis'

interface ApplicantDetailsClientProps {
  jobId: string;
  applicant: any; // Replace with proper type
}

export function ApplicantDetailsClient({ jobId, applicant }: ApplicantDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="profile">
                  <ApplicantProfile applicant={applicant} />
                </TabsContent>

                <TabsContent value="ai-analysis">
                  <ApplicantAIAnalysis applicant={applicant} />
                </TabsContent>

                <TabsContent value="timeline">
                  <ApplicantTimeline applicant={applicant} />
                </TabsContent>

                <TabsContent value="documents">
                  <ApplicantDocuments applicant={applicant} />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>

        <div>
          <ApplicantActions 
            jobId={jobId}
            applicant={applicant}
          />
        </div>
      </div>
    </div>
  )
}