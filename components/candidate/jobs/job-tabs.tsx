"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobDescription } from "./job-description"
import { JobCompany } from "./job-company"
import { JobRequirements } from "./job-requirements"

interface JobTabsProps {
  job: {
    description: string
    companyDescription: string
    requirements: readonly string[]
    responsibilities: readonly string[]
    skills: readonly string[]
    teamSize: string
    workplaceType: string
  }
}

export function JobTabs({ job }: JobTabsProps) {
  return (
    <Card className="p-6">
      <Tabs defaultValue="description" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="description" className="font-medium">
            Description
          </TabsTrigger>
          <TabsTrigger value="company" className="font-medium">
            Company
          </TabsTrigger>
          <TabsTrigger value="requirements" className="font-medium">
            Requirements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <JobDescription
            description={job.description}
            responsibilities={job.responsibilities}
            skills={job.skills}
          />
        </TabsContent>

        <TabsContent value="company">
          <JobCompany
            description={job.companyDescription}
            teamSize={job.teamSize}
            workplaceType={job.workplaceType}
          />
        </TabsContent>

        <TabsContent value="requirements">
          <JobRequirements requirements={job.requirements} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}