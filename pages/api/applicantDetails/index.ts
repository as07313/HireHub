import { Candidate } from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { Apiauth } from "@/app/middleware/auth";
import { Applicant } from "@/models/Applicant";
import { Job } from "@/models/Job";
import mongoose from "mongoose";
import { Resume } from "@/models/Resume";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { jobId, candidateId } = req.query;
  
    // Validate inputs
    if (!jobId || !candidateId || typeof jobId !== 'string' || typeof candidateId !== 'string') {
      return res.status(400).json({ error: 'Invalid job ID or applicant ID format' });
    }
  
    if (!mongoose.isValidObjectId(jobId) || !mongoose.isValidObjectId(candidateId)) {
      return res.status(400).json({ error: 'Invalid job ID or applicant ID' });
    }
  
    try {
      // Connect to MongoDB
      await connectToDatabase();
  
      // Find the applicant with the given jobId and candidateId
      const applicant = await Applicant.findOne({ jobId, candidateId });
  
      if (!applicant) {
        return res.status(404).json({ error: 'Applicant not found for the given job and candidate IDs' });
      }
  
      // Fetch the corresponding resume
      const resume = await Resume.findById(applicant.resumeId);
  
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found for the applicant' });
      }
  
      // Return the filename
      res.status(200).json({ filename: resume.fileName });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      // Disconnect only if not in production
      if (process.env.NODE_ENV !== 'production') {
        await mongoose.disconnect();
      }
    }
  }