// app/recruiter/jobs/[id]/applicants/[applicantsId]/page.tsx
import { ApplicantDetailsClient } from './applicant-details-client'

interface PageProps {
  params: Promise<{
    id: string;
    applicantId: string;
  }>
}

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


export default async function ApplicantDetailsPage({ params }: PageProps) {

  const { id } = await params;

  return (
    
    <ApplicantDetailsClient 
      jobId={id} 
      applicant={applicant}
    />
  )
}