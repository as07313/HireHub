// app/recruiter/jobs/[id]/applicants/[applicantsId]/page.tsx
import { ApplicantDetailsClient } from './applicant-details-client'
import { getApplicantDetail } from '@/app/actions/recruiter/get-applicant-detail'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string;
    applicantsId: string;
  }>
}

export default async function ApplicantDetailsPage({ params }: PageProps) {
  const { id, applicantsId } = await params;
  
  try {
    // Fetch real applicant data using the server action
    const applicant = await getApplicantDetail(id, applicantsId);
    
    return (
      <ApplicantDetailsClient 
        jobId={id} 
        applicant={applicant}
      />
    )
  } catch (error) {
    console.error('Failed to load applicant details:', error);
    notFound();
  }
}