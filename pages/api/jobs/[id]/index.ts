// pages/api/jobs/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { Apiauth }  from '@/app/middleware/auth'
import { Candidate } from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()
    const { id } = req.query

    const session = await Apiauth(req, res); // Use your API auth middleware

    // Ensure user is authenticated and is a recruiter
    if (!session || session.type !== 'recruiter') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const job = await Job.findById(id)
          .select('-applicants')

        if (!job) {
          return res.status(404).json({ error: 'Job not found' })
        }

        return res.status(200).json(job)

        case 'PUT':
          const user = await Apiauth(req, res)
          if (!user) {
            return res.status(402).json({error: "User not found"})
          }

          // Transform form data to match database schema
          const updateData = {
            ...req.body,
            requirements: req.body.requirements?.split('\n').filter(Boolean) || [],
            benefits: req.body.benefits?.split('\n').filter(Boolean) || [],
            skills: req.body.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
            employmentType: req.body.type, // Map type to employmentType
          }

          const updatedJob = await Job.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
          )

          return res.status(200).json(updatedJob)

          case 'DELETE':
            // Ensure the recruiter owns this job before deleting (optional but recommended)
            const jobToDelete = await Job.findById(id);
            if (!jobToDelete) {
              return res.status(404).json({ error: 'Job not found' });
            }
            if (jobToDelete.recruiterId.toString() !== session.userId) {
              return res.status(403).json({ error: 'Forbidden' });
            }
    
            // --- Actual Deletion ---
            const deleteResult = await Job.findByIdAndDelete(id);
            if (!deleteResult) {
               // Should ideally not happen if findById found it, but good practice
               return res.status(404).json({ error: 'Job not found during deletion' });
            }
            // --- End Actual Deletion ---
    
            // Optionally: Clean up related data (e.g., remove job from candidates' saved lists)
            await Candidate.updateMany({}, { $pull: { savedJobs: id } });
    
            return res.status(200).json({ message: 'Job deleted successfully' }); // Changed message
            
    
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling job:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}