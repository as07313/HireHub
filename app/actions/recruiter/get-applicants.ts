// app/actions/recruiter/get-applicants.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Applicant, IApplicant } from "@/models/Applicant"
import connectToDatabase from "@/lib/mongodb"
import { Document, Types } from 'mongoose'

// Define type for populated data
type PopulatedApplicant = Omit<IApplicant, 'candidateId' | 'resumeId'> & {
  candidateId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
  };
  resumeId: {
    _id: Types.ObjectId;
    fileName: string;
    filePath: string;
    uploadDate: Date;
  };
}

export async function getJobApplicants(jobId: string) {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    const applications = await Applicant.find({ 
      jobId: jobId 
    })
    .populate({
      path: 'candidateId',
      select: 'fullName email phone skills experience'
    })
    .populate({
      path: 'resumeId',
      select: 'fileName filePath uploadDate'
    })
    .sort({ appliedDate: -1 })
    .lean<PopulatedApplicant[]>()

    return applications.map(app => ({
      id: (app._id as Types.ObjectId).toString(),
      name: app.candidateId.fullName,
      email: app.candidateId.email,
      avatar:'https://i.pravatar.cc/150', // Provide default avatar
      phone: app.candidateId.phone,
      skills: app.candidateId.skills,
      experience: app.candidateId.experience,
      stage: app.status,
      appliedDate: app.appliedDate.toLocaleDateString(),
      jobFitScore: app.jobFitScore,
      aiAnalysis: app.aiAnalysis,
      resume: {
        id: app.resumeId._id.toString(),
        fileName: app.resumeId.fileName,
        filePath: app.resumeId.filePath,
        uploadDate: app.resumeId.uploadDate.toLocaleDateString()
      },
      interviews: app.interviews?.map(interview => ({
        ...interview,
        scheduledDate: new Date(interview.scheduledDate).toLocaleDateString()
      })) || []
    }))

  } catch (error) {
    console.error('Error fetching job applicants:', error)
    throw new Error('Failed to fetch job applicants')
  }
}