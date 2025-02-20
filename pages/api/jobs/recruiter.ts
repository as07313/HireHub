import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { Apiauth } from '@/app/middleware/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()

    switch (req.method) {
      case 'GET':
        // Get authenticated user
        const user = await Apiauth(req, res);
        
        if (!user || !user.userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find jobs posted by this recruiter only
        const jobs = await Job.find({ 
          recruiterId: user.userId,
          status: 'active' 
        })
        .sort({ postedDate: -1 })
        .select('-applicants')
        .populate({
          path: 'applicants',
          select: 'status',
          match: { status: { $exists: true } }
        });

        // Transform data to include applicant stats
        const transformedJobs = jobs.map(job => ({
          _id: job._id,
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.employmentType,
          status: job.status,
          applicants: job.applicants?.length || 0,
          postedDate: job.postedDate,
          salary: job.salary,
          experience: job.experience,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          applicantStats: {
            total: job.applicants?.length || 0,
            qualified: job.applicants?.filter(a => a.status === 'shortlist')?.length || 0,
            interviewing: job.applicants?.filter(a => a.status === 'interview')?.length || 0,
            hired: job.applicants?.filter(a => a.status === 'hired')?.length || 0
          }
        }));

        return res.status(200).json(transformedJobs);

      case 'POST':
        const postUser = await Apiauth(req, res);
        
        if (!postUser || !postUser.userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const jobData = {
          ...req.body,
          recruiterId: postUser.userId,
          requirements: req.body.requirements?.split('\n').filter(Boolean) || [],
          benefits: req.body.benefits?.split('\n').filter(Boolean) || [],
          skills: req.body.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
          workplaceType: req.body.workplaceType || 'onsite',
          employmentType: req.body.employmentType || 'full-time',
          status: 'active',
          postedDate: new Date(),
          applicants: []
        };
        
        console.log(jobData)
        const job = await Job.create(jobData);
        return res.status(201).json(job);

      default: 
        return res.status(405).json({error: 'Method not allowed'});
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}