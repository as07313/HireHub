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

    // Get all jobs posted by this recruiter
    const recruiterJobs = await Job.find({ 
      recruiterId: user.userId 
    });

    const jobIds = recruiterJobs.map(job => job._id);

    // Get application stats for these jobs
    const [totalCandidates, shortlisted, interviews, hired] = await Promise.all([
      Applicant.countDocuments({ 
        jobId: { $in: jobIds } 
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds }, 
        status: 'screening' 
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds }, 
        status: 'interview' 
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds }, 
        status: 'hired' 
      })
    ]);

    // Calculate trends (comparing to last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [
      lastMonthTotal,
      lastMonthShortlisted,
      lastMonthInterviews,
      lastMonthHired
    ] = await Promise.all([
      Applicant.countDocuments({ 
        jobId: { $in: jobIds },
        appliedDate: { $lt: lastMonth }
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds },
        status: 'shortlist',
        appliedDate: { $lt: lastMonth }
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds },
        status: 'interview',
        appliedDate: { $lt: lastMonth }
      }),
      Applicant.countDocuments({ 
        jobId: { $in: jobIds },
        status: 'hired',
        appliedDate: { $lt: lastMonth }
      })
    ]);

    // Calculate percentage changes
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return '+0%';
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    return res.status(200).json({
      stats: [
        { 
          label: 'Total Candidates', 
          value: totalCandidates,
          trend: calculateTrend(totalCandidates, lastMonthTotal),
          icon: 'Users' 
        },
        { 
          label: 'Shortlisted', 
          value: shortlisted,
          trend: calculateTrend(shortlisted, lastMonthShortlisted),
          icon: 'UserCheck' 
        },
        { 
          label: 'Interviews', 
          value: interviews,
          trend: calculateTrend(interviews, lastMonthInterviews),
          icon: 'UserCog' 
        },
        { 
          label: 'Hired', 
          value: hired,
          trend: calculateTrend(hired, lastMonthHired),
          icon: 'UserPlus' 
        }
      ]
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}