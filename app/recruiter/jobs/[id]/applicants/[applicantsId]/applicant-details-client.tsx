"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ApplicantProfile } from '@/components/recruiter/applicants/applicant-profile'
import { ApplicantActions } from '@/components/recruiter/applicants/applicant-actions'
import { ApplicantTimeline } from '@/components/recruiter/applicants/applicant-timeline'
import { ApplicantDocuments } from '@/components/recruiter/applicants/applicant-documents'
import { ApplicantAIAnalysis } from '@/components/recruiter/applicants/applicant-ai-analysis'
import { UserCircle, Brain, FileText, ArrowRight } from 'lucide-react'

interface ApplicantDetailsClientProps {
  jobId: string;
  applicant: any; // Replace with proper type
}

export function ApplicantDetailsClient({ jobId, applicant }: ApplicantDetailsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Sidebar Actions - Now on the left side */}
          <div className="lg:w-1/4 space-y-6">
            <div className="sticky top-12">
              <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl p-6 space-y-4">
                <div className="text-center">
                  <img 
                    src={applicant.avatar || '/default-avatar.png'} 
                    alt={applicant.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                  <h2 className="text-xl font-bold text-gray-800">{applicant.name}</h2>
                  <p className="text-sm text-gray-500">{applicant.currentRole}</p>
                </div>
                <ApplicantActions 
                  jobId={jobId}
                  applicant={applicant}
                />
              </Card>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl">
              <div className="relative">
                {/* Curved Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 relative">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Brain className="w-40 h-40" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Applicant Details</h1>
                  <p className="text-blue-100">Comprehensive view of the candidate's profile</p>
                </div>

                {/* Tabs with Unique Design */}
                <div className="bg-white p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full bg-transparent p-0 flex justify-start border-b-2 border-gray-100 mb-6">
                      {[
                        { value: 'profile', label: 'Profile', icon: UserCircle },
                        { value: 'ai-analysis', label: 'AI Analysis', icon: Brain },
                        { value: 'documents', label: 'Documents', icon: FileText }
                      ].map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={`
                            relative px-4 py-3 flex items-center space-x-2 
                            text-gray-500 hover:text-blue-600 
                            data-[state=active]:text-blue-700 
                            data-[state=active]:font-semibold
                            transition-all duration-300
                            group
                          `}
                        >
                          <tab.icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                          <ArrowRight 
                            className="
                              w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 
                              ml-2 text-blue-600 transition-all duration-300
                            "
                          />
                          {activeTab === tab.value && (
                            <span 
                              className="
                                absolute bottom-0 left-0 right-0 h-0.5 
                                bg-blue-600 transform scale-x-100
                                transition-transform duration-300
                              "
                            />
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="space-y-6">
                      <TabsContent value="profile">
                        <ApplicantProfile applicant={applicant} />
                      </TabsContent>
                      <TabsContent value="ai-analysis">
                        <ApplicantAIAnalysis applicant={applicant} />
                      </TabsContent>
                      <TabsContent value="documents">
                        <ApplicantDocuments applicant={applicant} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}