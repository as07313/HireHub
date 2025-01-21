// components/jobs/job-details.tsx
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JobHeader } from "@/components/candidate/jobs/job-header"
import { JobTabs } from "@/components/candidate/jobs/job-tabs"
import { JobOverview } from "@/components/candidate/jobs/job-overview"
import { JobBenefits } from "@/components/candidate/jobs/job-benefits"

// Update interface to match IJob model
interface JobDetailsProps {
  job: {
    id: string;
    recruiterId: string;
    title: string;
    department: string;
    location: string;
    workplaceType: 'onsite' | 'hybrid' | 'remote';
    employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
    status: 'active' | 'inactive' | 'closed';
    salary: {
      min: string;
      max: string;
    };
    experience: 'entry' | 'mid' | 'senior' | 'lead';
    description: string;
    requirements: string[];
    benefits: string[];
    skills: string[];
    postedDate: Date;
    // Additional fields for UI purposes
    logo: string;
    company: string;
    companyDescription?: string;
  };
  backLink: string;
  backLabel: string;
  showActions?: boolean;
  showApplyButton?: boolean;
}

export function JobDetails({ 
  job, 
  backLink, 
  backLabel,
  showActions = false,
  showApplyButton = false 
}: JobDetailsProps) {
  if (!job) {
    return <div>Job not found</div>;
  }

  // Transform job data to match component interfaces
  const transformedJob = {
    ...job,
    // Format salary for display
    salary: `$${job.salary.min}-${job.salary.max}`,
    // Format date for display
    postedDate: new Date(job.postedDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    // Map employment type and workplace type
    type: job.employmentType,
    workplaceType: job.workplaceType
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link 
        href={backLink} 
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <JobHeader 
            job={transformedJob} 
            showActions={showActions} 
          />
          <JobTabs 
            job={{
              description: job.description,
              requirements: job.requirements,
              responsibilities: [], // Not in model, could be part of description
              skills: job.skills,
              companyDescription: job.companyDescription || '',
              teamSize: '', // Not in model
              workplaceType: job.workplaceType
            }} 
          />
        </div>

        <div className="space-y-6">
          <JobOverview 
            job={{
              experience: job.experience,
              salary: `$${job.salary.min}-${job.salary.max}`,
              education: 'Not specified' // Not in model
            }}
            showApplyButton={showApplyButton} 
          />
          <JobBenefits benefits={job.benefits} />
        </div>
      </div>
    </div>
  );
}