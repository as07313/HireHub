"use server"

import { auth } from "@/app/middleware/auth"
import { Applicant } from "@/models/Applicant"
import { Candidate } from "@/models/User"
import { Resume } from "@/models/Resume"
import connectToDatabase from "@/lib/mongodb"
import { Types } from "mongoose"

// Define interfaces for type safety
interface IApplicantPopulated {
  _id: Types.ObjectId;
  candidateId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
  };
  jobId: Types.ObjectId;
  status: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  jobFitScore: number;
  resumeId?: {
    _id: Types.ObjectId;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    parsedData?: Record<string, any>; // Add parsedData here

  };
  coverLetter?: string;
  interviews?: Array<{
    scheduledDate: Date;
    type: 'technical' | 'hr' | 'cultural' | 'final';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
    interviewer?: Types.ObjectId;
  }>;
  aiAnalysis?: {
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
  };
}

export async function getApplicantDetail(jobId: string, applicantId: string) {
  try {
    await connectToDatabase()
    
    // Authenticate the user as a recruiter
    const session = await auth()
    if (!session || session.type !== 'recruiter') {
      throw new Error('Unauthorized: Only recruiters can view applicant details')
    }

    // Validate IDs
    if (!Types.ObjectId.isValid(jobId) || !Types.ObjectId.isValid(applicantId)) {
      throw new Error('Invalid job or applicant ID')
    }

    // Find the application with populated related data
    const application = await Applicant.findOne({
      _id: applicantId,
      jobId: jobId
    })
    .populate({
      path: 'candidateId',
      model: Candidate,
      select: 'fullName email phone skills experience'
    })
    .populate({
      path: 'resumeId',
      model: Resume,
      select: 'fileName filePath uploadDate parsedData'
    })
    .lean<IApplicantPopulated>()

    if (!application || !application.candidateId) {
      throw new Error('Applicant not found')
    }

    // Transform application data to match the expected format
    return {
      id: application._id.toString(),
      name: application.candidateId.fullName || '',
      email: application.candidateId.email || '',
      avatar: `https://i.pravatar.cc/150?u=${application._id}`,
      phone: application.candidateId.phone || '',
      skills: application.candidateId.skills || [],
      experience: application.candidateId.experience || '',
      stage: application.status || 'new',
      jobFitScore: application.jobFitScore || 0,
      appliedDate: application.appliedDate.toISOString().split('T')[0],
      // Adding company and education to be compatible with components
      currentRole: '',
      currentCompany: '',
      education: {
        degree: '',
        school: '',
        year: ''
      },
      aiAnalysis: application.aiAnalysis || {
        technicalSkills: {
          score: 0,
          strengths: [],
          gaps: []
        },
        experience: {
          score: 0,
          strengths: [],
          gaps: []
        },
        education: {
          score: 0,
          strengths: [],
          gaps: []
        }
      },
      resume: application.resumeId ? {
        id: application.resumeId._id.toString(),
        fileName: application.resumeId.fileName || '',
        filePath: application.resumeId.filePath || '',
        uploadDate: new Date(application.resumeId.uploadDate).toISOString().split('T')[0],
        parsedData: application.resumeId.parsedData || null // Add parsedData here

      } : null,
      interviews: (application.interviews || []).map((interview) => ({
        scheduledDate: new Date(interview.scheduledDate).toISOString().split('T')[0],
        type: interview.type,
        status: interview.status,
        feedback: interview.feedback || ''
      })),
      // Providing minimal data for document display based on resume
      documents: application.resumeId ? [
        {
          type: "resume",
          name: application.resumeId.fileName || "Resume.pdf",
          size: "Unknown",
          lastModified: new Date(application.resumeId.uploadDate).toISOString().split('T')[0]
        }
      ] : [],
      // If there's a cover letter, add it
      ...(application.coverLetter && {
        documents: [
          ...(application.resumeId ? [{
            type: "resume",
            name: application.resumeId.fileName || "Resume.pdf",
            size: "Unknown",
            lastModified: new Date(application.resumeId.uploadDate).toISOString().split('T')[0]
          }] : []),
          {
            type: "cover_letter",
            name: "Cover_Letter.pdf",
            size: "Unknown",
            lastModified: application.appliedDate.toISOString().split('T')[0]
          }
        ]
      }),
      // Adding minimal work history based on experience
      workHistory: [
        {
          role: "Current Role",
          company: "Current Company",
          duration: "Present",
          description: application.candidateId.experience || ''
        }
      ]
    }

  } catch (error) {
    console.error('Error fetching applicant details:', error)
    throw error
  }
}