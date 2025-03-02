export interface JobApplicant {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  skills: string[]
  experience: string
  stage: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected'
  jobFitScore: number
  appliedDate: string
  company?: string
  aiAnalysis: {
    technicalSkills: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    experience: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
    education: {
      score: number;
      strengths: string[];
      gaps: string[];
    };
  } | null;
  resume: {
    id: string;
    fileName: string;
    filePath: string;
    uploadDate: string;
  } | null;
  interviews?: Array<{
    scheduledDate: string;
    type: 'technical' | 'hr' | 'cultural' | 'final';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
  }>;
}