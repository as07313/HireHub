// pages/api/jobs/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { Apiauth } from '@/app/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()

    switch (req.method) {
      case 'GET':
        const jobs = await Job.find({status: 'active'})
          .sort({postedDate: -1})
          .select('-applicants');
        return res.status(200).json(jobs);

      case 'POST':
        const user = await Apiauth(req, res);
        
        if (!user || !user.userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate and transform request body to match IJob interface
        const jobData = {
          ...req.body,
          recruiterId: user.userId,
          requirements: req.body.requirements?.split('\n').filter(Boolean) || [],
          benefits: req.body.benefits?.split('\n').filter(Boolean) || [],
          skills: req.body.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          workplaceType: req.body.workplaceType || 'onsite',
          employmentType: req.body.employmentType || 'full-time',
          status: 'active',
          postedDate: new Date(),
          applicants: []
        };

        // Create job with validated data
        const job = await Job.create(jobData);
        return res.status(201).json(job);

      default: 
        return res.status(405).json({error: 'Method not allowed'});
    }
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}