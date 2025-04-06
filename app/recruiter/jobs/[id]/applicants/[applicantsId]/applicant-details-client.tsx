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
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  UserCircle, 
  Brain, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  Building2,
  MapPin,
  Star,
  ChevronLeft,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'

interface ApplicantDetailsClientProps {
  jobId: string;
  applicant: any; // Replace with proper type
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

  // Calculate scores
  const technicalScore = applicant.aiAnalysis?.technicalSkills?.score || 0;
  const experienceScore = applicant.aiAnalysis?.experience?.score || 0;
  const educationScore = applicant.aiAnalysis?.education?.score || 0;
  const overallScore = Math.round((technicalScore + experienceScore + educationScore) / 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/recruiter/jobs/${jobId}/applicants`}
          className="group inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary mb-6 transition-all"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <span>Back to applicants</span>
        </Link>
        
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <img 
                src={applicant.avatar || '/default-avatar.png'} 
                alt={applicant.name} 
                className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white ring-2 ring-slate-100"
              />
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800">{applicant.name}</h1>
                <Badge 
                  className={`${stageColorMap[applicant.stage] || 'bg-slate-100'} border px-2.5 py-0.5 text-xs font-medium`}
                >
                  {applicant.stage?.charAt(0).toUpperCase() + applicant.stage?.slice(1) || 'New'}
                </Badge>
              </div>
              <p className="text-slate-500">{applicant.currentRole || 'No current role'}{applicant.currentCompany ? ` at ${applicant.currentCompany}` : ''}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                {applicant.email && (
                  <a href={`mailto:${applicant.email}`} className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>{applicant.email}</span>
                  </a>
                )}
                
                {applicant.phone && (
                  <a href={`tel:${applicant.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                    <span>{applicant.phone}</span>
                  </a>
                )}
                
                {applicant.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{applicant.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Applied {new Date(applicant.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto mt-4 md:mt-0">
              <div className="inline-flex flex-col items-center bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                  <span className="text-sm font-medium text-slate-700">Job Fit Score</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 mt-1">{applicant.jobFitScore}%</div>
                <div className="w-full mt-2">
                  <Progress value={applicant.jobFitScore} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Key Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-slate-100 shadow-md">
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Analysis Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Match</span>
                  <span className="text-lg font-bold">{overallScore}%</span>
                </div>
                <Progress value={overallScore} className="h-2" />
                
                <div className="pt-2 space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Technical Skills</span>
                      <span className="font-medium">{technicalScore}%</span>
                    </div>
                    <Progress value={technicalScore} className="h-1.5 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Experience</span>
                      <span className="font-medium">{experienceScore}%</span>
                    </div>
                    <Progress value={experienceScore} className="h-1.5 mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Education</span>
                      <span className="font-medium">{educationScore}%</span>
                    </div>
                    <Progress value={educationScore} className="h-1.5 mt-1" />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setActiveTab('ai-analysis')}
                >
                  View Full Analysis
                </Button>
              </div>
            </Card>
            
            <Card className="border-slate-100 shadow-md">
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Key Skills
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {applicant.skills && applicant.skills.slice(0, 10).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                  {(!applicant.skills || applicant.skills.length === 0) && (
                    <p className="text-sm text-slate-500">No skills listed</p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="border-slate-100 shadow-md">
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b">
                <h2 className="font-bold text-lg flex items-center gap-2">
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
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-slate-100 shadow-md">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="h-auto p-0 bg-transparent flex">
                    {[
                      { value: 'profile', label: 'Profile', icon: UserCircle },
                      { value: 'ai-analysis', label: 'AI Analysis', icon: Brain },
                      { value: 'documents', label: 'Documents', icon: FileText }
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`
                          flex items-center gap-2 py-4 px-6 relative rounded-none border-b-2 
                          data-[state=active]:border-primary data-[state=active]:text-primary
                          data-[state=inactive]:border-transparent
                          transition-all font-medium text-sm
                        `}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="profile" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ApplicantProfile applicant={applicant} />
                  </TabsContent>
                  <TabsContent value="ai-analysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ApplicantAIAnalysis applicant={applicant} />
                  </TabsContent>
                  <TabsContent value="documents" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
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