"use server"

import { auth } from "@/app/middleware/auth"
import { Applicant, IApplicant } from "@/models/Applicant"
import { Resume } from "@/models/Resume"
import connectToDatabase from "@/lib/mongodb"
import { Document, Types } from 'mongoose'
import { JobApplicant } from "@/app/types/applicant"

type PopulatedApplicant = {
  _id: Types.ObjectId;
  status: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  jobFitScore: number;
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
  };
  interviews: Array<{
    scheduledDate: Date;
    type: 'technical' | 'hr' | 'cultural' | 'final';
    status: 'scheduled' | 'completed' | 'cancelled';
    feedback?: string;
  }>;
  candidateId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
  } | null;
  resumeId: {
    _id: Types.ObjectId;
    fileName: string;
    filePath: string;
    uploadDate: Date;
  } | null;
};

export async function getJobApplicants(jobId: string): Promise<JobApplicant[]> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      return [] // Return empty array instead of throwing error
    }

    const applications = await Applicant.find({ jobId })
      .populate({
        path: 'candidateId',
        select: 'fullName email phone skills experience location currentRole company'
      })
      .populate({
        path: 'resumeId',
        model: Resume,
        select: 'fileName filePath uploadDate'
      })
      .sort({ appliedDate: -1 })
      .lean<PopulatedApplicant[]>()

    if (!applications?.length) {
      return []
    }

    const application0s = await Applicant.find({ jobId })
    console.log('Raw applications from DB:', application0s.length)

    // Use reduce instead of filter+map for better performance and cleaner code
    return applications.reduce<JobApplicant[]>((acc, app) => {
      if (!app.candidateId) return acc // Skip invalid applications

      // Create consistent applicant object
      const applicant: JobApplicant = {
        id: String(app._id),
        name: app.candidateId.fullName || 'Unknown',
        email: app.candidateId.email || '',
        avatar: `https://i.pravatar.cc/150?u=${app._id}`, // Make avatar deterministic
        phone: app.candidateId.phone || '',
        skills: app.candidateId.skills || [],
        experience: app.candidateId.experience || '', 
        stage: app.status || 'new',
        appliedDate: new Date(app.appliedDate).toISOString(), // Consistent date format
        jobFitScore: app.jobFitScore || 0,
        aiAnalysis: app.aiAnalysis || {
          technicalSkills: { score: 0, strengths: [], gaps: [] },
          experience: { score: 0, strengths: [], gaps: [] },
          education: { score: 0, strengths: [], gaps: [] }
        },
        resume: app.resumeId ? {
          id: String(app.resumeId._id),
          fileName: app.resumeId.fileName || '',
          filePath: app.resumeId.filePath || '',
          uploadDate: new Date(app.resumeId.uploadDate).toISOString()
        } : null,
        interviews: (app.interviews || []).map(interview => ({
          scheduledDate: new Date(interview.scheduledDate).toISOString(),
          type: interview.type,
          status: interview.status,
          feedback: interview.feedback || ''
        }))
      }

      acc.push(applicant)
      console.log(acc)
      return acc
    }, [])

  } catch (error) {
    console.error('Error fetching job applicants:', error)
    return [] // Return empty array on error
  }
}