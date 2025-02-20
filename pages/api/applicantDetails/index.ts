import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import { Apiauth } from "@/app/middleware/auth";
import { Applicant } from "@/models/Applicant";
import { Resume } from "@/models/Resume"; // Add Resume model import
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobId } = req.query;

  // Validate jobId
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }

  if (!mongoose.isValidObjectId(jobId)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    await connectToDatabase();
    
    // Authenticate request
    const user = await Apiauth(req, res);
    if (!user || user.type !== 'recruiter') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find all applicants for the job with populated data
    const applicants = await Applicant.find({ jobId })
      .populate({
        path: 'candidateId',
        select: 'fullName email phone skills experience location currentRole company'
      })
      .populate({
        path: 'resumeId',
        model: Resume, // Explicitly specify the Resume model
        select: 'fileName uploadDate'
      })
      .sort({ appliedDate: -1 });

    // Transform data for response
    const transformedApplicants = applicants.map(app => ({
      id: app._id.toString(),
      name: app.candidateId.fullName,
      email: app.candidateId.email,
      phone: app.candidateId.phone,
      skills: app.candidateId.skills || [],
      experience: app.candidateId.experience,
      location: app.candidateId.location,
      currentRole: app.candidateId.currentRole,
      company: app.candidateId.company,
      stage: app.status,
      jobFitScore: app.jobFitScore || 0,
      appliedDate: app.appliedDate.toLocaleDateString(),
      resume: {
        fileName: app.resumeId.fileName,
        uploadDate: app.resumeId.uploadDate.toLocaleDateString()
      }
    }));

    return res.status(200).json(transformedApplicants);

  } catch (error) {
    console.error('Error fetching applicants:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}