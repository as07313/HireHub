import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Applicant } from '@/models/Applicant';
import { Job } from '@/models/Job';
import { Apiauth } from '@/app/middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const user = await Apiauth(req, res);
    
    if (!user || user.type !== 'recruiter') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get recruiter's jobs
    const jobs = await Job.find({ recruiterId: user.userId });
    const jobIds = jobs.map(job => job._id);

    // Get applications for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get monthly applications count
    const monthlyApplications = await Applicant.aggregate([
      {
        $match: {
          jobId: { $in: jobIds },
          appliedDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$appliedDate' },
            year: { $year: '$appliedDate' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get applications by stage
    const applicationsByStage = await Applicant.aggregate([
      {
        $match: {
          jobId: { $in: jobIds }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      monthlyApplications,
      applicationsByStage
    });

  } catch (error) {
    console.error('Error fetching chart data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}