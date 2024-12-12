'use client';

import { useState } from 'react';
import { ApplicantProfile } from '@/components/recruiter/applicants/applicant-profile';
import { ApplicantActions } from '@/components/recruiter/applicants/applicant-actions';
import { ApplicantHeader } from '@/components/recruiter/applicants/applicant-header';
import { ApplicantTimeline } from '@/components/recruiter/applicants/applicant-timeline';
import { ApplicantDocuments } from '@/components/recruiter/applicants/applicant-documents';
import { ApplicantAIAnalysis } from '@/components/recruiter/applicants/applicant-ai-analysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Mock data - Replace with API call
const applicant = {
  id: "1",
  name: "John Smith",
  avatar: "https://i.pravatar.cc/150?u=1",
  email: "john.s@example.com",
  phone: "+1 (555) 000-0000",
  jobFitScore: 95,
  stage: "screening",
  appliedDate: "2024-03-15",
  experience: "5 years",
  location: "New York, USA",
  skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
  education: {
    degree: "BS Computer Science",
    school: "University of Technology",
    year: "2019"
  },
  currentRole: "Senior Frontend Developer",
  currentCompany: "Tech Corp",
  bio: "Experienced frontend developer with a passion for building scalable web applications. Strong background in modern JavaScript frameworks and state management.",
  workHistory: [
    {
      role: "Senior Frontend Developer",
      company: "Tech Corp",
      duration: "2021 - Present",
      description: "Leading frontend development for enterprise applications"
    },
    {
      role: "Frontend Developer",
      company: "StartupCo",
      duration: "2019 - 2021",
      description: "Developed and maintained multiple React applications"
    }
  ],
  documents: [
    {
      type: "resume",
      name: "John_Smith_Resume.pdf",
      size: "245 KB",
      lastModified: "2024-03-15"
    },
    {
      type: "cover_letter",
      name: "Cover_Letter.pdf",
      size: "180 KB",
      lastModified: "2024-03-15"
    }
  ]
};

export default function ApplicantDetailsPage({
  params
}: {
  params: { jobId: string; applicantId: string }
}) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <ApplicantHeader 
        jobId={params.jobId}
        applicant={applicant}
      />

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
            jobId={params.jobId}
            applicant={applicant}
          />
        </div>
      </div>
    </div>
  );
}