'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Mail, Phone, Building2, UserCircle } from 'lucide-react';

interface ApplicantHeaderProps {
  jobId: string;
  applicant: any;
}

const stageStyles = {
  new: "bg-blue-100 text-blue-800",
  screening: "bg-purple-100 text-purple-800",
  interview: "bg-yellow-100 text-yellow-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800"
};

export function ApplicantHeader({ jobId, applicant }: ApplicantHeaderProps) {
  return (
    <div className="space-y-6">
      <Link
        href={`/recruiter/jobs/${jobId}/applicants`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applicants
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-[100px] w-[100px] rounded-full bg-muted flex items-center justify-center">
          <UserCircle className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{applicant.name}</h1>
            <Badge 
              variant="secondary"
              className={stageStyles[applicant.stage as keyof typeof stageStyles]}
            >
              {applicant.stage.charAt(0).toUpperCase() + applicant.stage.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {applicant.currentRole} at {applicant.currentCompany}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {applicant.location}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {applicant.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {applicant.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}