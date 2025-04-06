import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Job } from '@/models/Job';
import { Applicant } from '@/models/Applicant';
import { Apiauth } from '@/app/middleware/auth';
import redis from '@/lib/redis';

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
    
    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // If a specific task ID is requested
    const { taskId } = req.query;
    if (taskId && typeof taskId === 'string') {
      // Get specific task status
      const taskStatus = await redis.get(`ranking:job:${jobId}:status`);
      if (taskStatus) {
        const statusData = JSON.parse(taskStatus);
        if (statusData.taskId === taskId) {
          return res.status(200).json(statusData);
        }
      }
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Get current status
    const statusData = await redis.get(`ranking:job:${jobId}:status`);
    if (statusData) {
      return res.status(200).json(JSON.parse(statusData));
    }
    
    // If no status, check database stats
    const totalApplicants = await Applicant.countDocuments({ jobId });
    const rankedApplicants = await Applicant.countDocuments({ 
      jobId, 
      jobFitScore: { $exists: true, $gt: 0 } 
    });
    
    // Check if we have cached results
    const hasCachedResults = await redis.get(`ranking:job:${jobId}:results`) !== null;
    
    return res.status(200).json({
      jobId,
      status: job.rankingStatus || 'not_started',
      lastRankedAt: job.lastRankedAt,
      total: totalApplicants,
      processed: rankedApplicants,
      progress: totalApplicants > 0 ? Math.round((rankedApplicants / totalApplicants) * 100) : 0,
      hasCachedResults,
      timestamp: Date.now()
    });
    
  } catch (error: any) {
    console.error('Error checking ranking status:', error);
    
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}