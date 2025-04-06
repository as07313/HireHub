import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Applicant } from '@/models/Applicant';
import { Candidate } from '@/models/User';
import { Resume } from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import mongoose, { Types } from 'mongoose';

// Define interfaces to properly type the populated document
interface PopulatedResume {
  _id: Types.ObjectId;
  fileName: string;
  filePath: string;
  uploadDate: Date;
}

interface PopulatedCandidate {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
}

interface InterviewItem {
  scheduledDate: Date;
  type: 'technical' | 'hr' | 'cultural' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
}

interface AIAnalysisSection {
  score: number;
  strengths: string[];
  gaps: string[];
}

interface PopulatedApplicant {
  _id: Types.ObjectId;
  candidateId: PopulatedCandidate;
  status: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  jobFitScore: number;
  resumeId?: PopulatedResume;
  interviews?: InterviewItem[];
  aiAnalysis?: {
    technicalSkills: AIAnalysisSection;
    experience: AIAnalysisSection;
    education: AIAnalysisSection;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Authenticate the request
    const user = await Apiauth(req, res);
    if (!user || user.type !== 'recruiter') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: jobId } = req.query;
    
    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    // Find all applicants for the job with populated data
    const applications = await Applicant.find({ jobId })
      .populate({
        path: 'candidateId',
        model: Candidate,
        select: 'fullName email phone skills experience'
      })
      .populate({
        path: 'resumeId',
        model: Resume,
        select: 'fileName filePath uploadDate'
      })
      .sort({ appliedDate: -1 })
      .lean<PopulatedApplicant[]>();

    // Transform the data to match the JobApplicant interface
    const transformedApplicants = applications.map((app: PopulatedApplicant) => ({
      id: app._id.toString(),
      name: app.candidateId?.fullName || 'Unknown Candidate',
      email: app.candidateId?.email || '',
      phone: app.candidateId?.phone || '',
      skills: app.candidateId?.skills || [],
      experience: app.candidateId?.experience || '',
      stage: app.status || 'new',
      jobFitScore: app.jobFitScore || 0,
      appliedDate: app.appliedDate.toISOString(),
      aiAnalysis: app.aiAnalysis || {
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
      resume: app.resumeId ? {
        id: app.resumeId._id.toString(),
        fileName: app.resumeId.fileName || '',
        filePath: app.resumeId.filePath || '',
        uploadDate: new Date(app.resumeId.uploadDate).toISOString()
      } : null,
      interviews: (app.interviews || []).map((interview: InterviewItem) => ({
        scheduledDate: new Date(interview.scheduledDate).toISOString(),
        type: interview.type,
        status: interview.status,
        feedback: interview.feedback || ''
      }))
    }));

    return res.status(200).json(transformedApplicants);

  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}