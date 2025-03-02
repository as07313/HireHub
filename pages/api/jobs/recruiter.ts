import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job, IJob } from '@/models/Job'
import { Apiauth } from '@/app/middleware/auth'
import { BaseJob } from '@/app/types/job'

// Define interfaces for type safety
interface IApplicant {
  status: 'new' | 'shortlist' | 'interview' | 'hired' | 'rejected'
  _id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()

    switch (req.method) {
      case 'GET':
        const user = await Apiauth(req, res);
        
        if (!user || !user.userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const jobs = await Job.find({ 
          recruiterId: user.userId,
          status: 'active' 
        })
        .sort({ postedDate: -1 })
        .populate({
          path: 'applicants',
          model: 'Applicant',
          select: 'status jobFitScore appliedDate',
          populate: {
            path: 'candidateId',
            model: 'Candidate',
            select: 'fullName email'
          }
        });
        

        const transformedJobs = jobs.map((job): BaseJob & { applicantStats: any } => ({
          _id: job._id.toString(),
          title: job.title,
          department: job.department,
          location: job.location,
          workplaceType: job.workplaceType,
          employmentType: job.employmentType,
          status: job.status,
          salary: job.salary,
          experience: job.experience,
          description: job.description,
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          skills: job.skills || [],
          postedDate: job.postedDate,
          applicantStats: {
            array: job.applicants,
            total: job.applicants?.length || 0,
            qualified: job.applicants?.filter((a: IApplicant) => a.status === 'shortlist')?.length || 0,
            interviewing: job.applicants?.filter((a: IApplicant) => a.status === 'interview')?.length || 0,
            hired: job.applicants?.filter((a: IApplicant) => a.status === 'hired')?.length || 0
          }
        }));

        console.log(transformedJobs)

        return res.status(200).json(transformedJobs);

      case 'POST':
        const postUser = await Apiauth(req, res);
        
        if (!postUser || !postUser.userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const jobData: Partial<IJob> = {
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