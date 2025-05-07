"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApplicantProfile } from '@/components/recruiter/applicants/applicant-profile'
import { ApplicantActions } from '@/components/recruiter/applicants/applicant-actions'
import { ApplicantDocuments } from '@/components/recruiter/applicants/applicant-documents'
import { ApplicantAIAnalysis } from '@/components/recruiter/applicants/applicant-ai-analysis'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added Tooltip components
import {
  UserCircle,
  Brain,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronLeft,
  HelpCircle, // Added HelpCircle
} from 'lucide-react'
import Link from 'next/link'

interface ApplicantDetailsClientProps {
  jobId: string;
  applicant: any; // Replace with proper type like JobApplicant from @/app/types/applicant
}

export function ApplicantDetailsClient({ jobId, applicant }: ApplicantDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')

  const stageColorMap: Record<string, string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    screening: "bg-purple-100 text-purple-800 border-purple-200",
    interview: "bg-yellow-100 text-yellow-800 border-yellow-200",
    offer: "bg-green-100 text-green-800 border-green-200",
    hired: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };

  // Calculate scores safely
  const technicalScore = applicant?.aiAnalysis?.technicalSkills?.score ?? 0;
  const experienceScore = applicant?.aiAnalysis?.experience?.score ?? 0;
  const educationScore = applicant?.aiAnalysis?.education?.score ?? 0;

  const jobFitScore = applicant?.jobFitScore ?? 0;
  const applicantName = applicant?.resume?.parsedData?.Name ?? applicant?.name ?? 'Unnamed Applicant';

  let applicantEmail = applicant?.email ?? '';
  let applicantPhone = applicant?.phone ?? '';

  const contactInfo = applicant?.resume?.parsedData?.['Contact Information'];
  if (typeof contactInfo === 'string') {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\(\+\d{1,9}\)|\+\d{1,9})?[\s.-]?\d{3}[\s.-]?\d{3}[\.s.-]?\d{4}/; // More flexible phone regex

    const emailMatch = contactInfo.match(emailRegex);
    if (emailMatch) {
      applicantEmail = emailMatch[0];
    }

    const phoneMatch = contactInfo.match(phoneRegex);
    if (phoneMatch) {
      applicantPhone = phoneMatch[0];
    }
  }
  
  const applicantLocation = applicant?.location ?? ''; // Assuming location might be available
  const applicantAppliedDate = applicant?.appliedDate ? new Date(applicant.appliedDate) : null;
  const softSkillsScore = jobFitScore - (technicalScore + experienceScore + educationScore); 
  return (
    <div className="min-h-screen bg-white"> {/* Simplified background */}
      <div className="container max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/recruiter/jobs/${jobId}`}
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow-sm group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <span>Back to applicants</span>
        </Link>

        {/* Header Section */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"> {/* Adjusted styling */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start"> {/* Changed to items-start */}
            <div className="flex-shrink-0">
              {/* Placeholder Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner ring-1 ring-slate-200 sm:h-24 sm:w-24">
                <UserCircle className="h-10 w-10 text-blue-400 sm:h-12 sm:w-12" />
              </div>
            </div>
            <div className="flex-grow space-y-3"> {/* Increased spacing */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"> {/* Use baseline alignment */}
                <h1 className="text-2xl font-bold text-slate-800">{applicantName}</h1>
                <Badge
                  className={`${stageColorMap[applicant.stage] || 'border-slate-200 bg-slate-100 text-slate-700'} border px-2.5 py-0.5 text-xs font-medium`}
                >
                  {applicant.stage?.charAt(0).toUpperCase() + applicant.stage?.slice(1) || 'New'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm"> {/* Adjusted gap and padding */}
                {applicantEmail && (
                  <a href={`mailto:${applicantEmail}`} className="flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{applicantEmail}</span>
                  </a>
                )}

                {applicantPhone && (
                  <a href={`tel:${applicantPhone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{applicantPhone}</span>
                  </a>
                )}

                {applicantLocation && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{applicantLocation}</span>
                  </div>
                )}

                {applicantAppliedDate && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Applied {applicantAppliedDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 w-full shrink-0 md:ml-auto md:mt-0 md:w-auto">
              <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:min-w-[160px]"> {/* Adjusted styling */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Job Fit Score</span>
                </div>
                <div className="mt-1 text-3xl font-bold text-slate-800">{jobFitScore}%</div>
                <div className="mt-2 w-full">
                  <Progress value={jobFitScore} className="h-1.5 bg-slate-100" /> {/* Added background color */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Key Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm"> {/* Adjusted border/shadow */}
              <div className="border-b border-slate-200 bg-slate-50 p-4"> {/* Simplified background */}
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Analysis Summary
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-3">
                        <p className="text-sm font-medium mb-1">Job Fit Score Calculation:</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          The Job Fit Score is determined by GPT 4o model analyzing the candidate's resume against the job description.
                        </p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          <li><strong>Technical Skills:</strong> Out of 40 %</li>
                          <li><strong>Experience:</strong> Out of 30 %</li>
                          <li><strong>Education:</strong> Out of 15 %</li>
                          <li><strong>Soft Skills:</strong> Out of 15 %</li> {/* Added Soft Skills */}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          The AI provides scores for each category, along with identified strengths and areas for improvement. The total score reflects the overall alignment.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h2>
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Technical Skills</span>
                      <span className="font-medium">{technicalScore}%</span>
                    </div>
                    <Progress value={(technicalScore/40)*100} className="mt-1 h-1.5 bg-slate-100" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Experience</span>
                      <span className="font-medium">{experienceScore}%</span>
                    </div>
                    <Progress value={(experienceScore/30)*100} className="mt-1 h-1.5 bg-slate-100" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Education</span>
                      <span className="font-medium">{educationScore}%</span>
                    </div>
                    <Progress value={(educationScore/15)*100} className="mt-1 h-1.5 bg-slate-100" />
                  </div>

                  <div> {/* Added Soft Skills Card */}
                    <div className="flex items-center justify-between text-sm">
                      <span>Soft Skills</span>
                      <span className="font-medium">{softSkillsScore < 0 ? 0 : softSkillsScore}%</span> {/* Ensure score is not negative */}
                    </div>
                    <Progress value={softSkillsScore < 0 ? 0 : (softSkillsScore/15)*100} className="mt-1 h-1.5 bg-slate-100" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-slate-200 shadow-sm"> {/* Adjusted border/shadow */}
              <div className="border-b border-slate-200 bg-slate-50 p-4"> {/* Simplified background */}
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Applicant Actions
                </h2>
              </div>
              <div className="p-6">
                <ApplicantActions
                  jobId={jobId}
                  applicant={applicant}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-slate-200 shadow-sm"> {/* Adjusted border/shadow */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-slate-200"> {/* Ensure border color consistency */}
                  <TabsList className="flex h-auto bg-transparent p-0">
                    {[
                      { value: 'profile', label: 'Profile', icon: UserCircle },
                      { value: 'ai-analysis', label: 'AI Analysis', icon: Brain },
                      { value: 'documents', label: 'Documents', icon: FileText }
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`
                          relative flex flex-1 items-center justify-center gap-2 rounded-none border-b-2
                          px-3 py-3 text-sm font-medium
                          data-[state=active]:border-primary data-[state=active]:text-primary
                          data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-600
                          hover:bg-slate-50 hover:text-slate-800
                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0
                          transition-colors
                        `}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="p-6 min-h-[400px]"> {/* Added min-height */}
                  <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
                    <ApplicantProfile applicant={applicant} />
                  </TabsContent>
                  <TabsContent value="ai-analysis" className="mt-0 focus-visible:outline-none">
                    <ApplicantAIAnalysis applicant={applicant} />
                  </TabsContent>
                  <TabsContent value="documents" className="mt-0 focus-visible:outline-none">
                    <ApplicantDocuments applicant={applicant} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}