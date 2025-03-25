import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Job } from '@/models/Job';
import { Applicant } from '@/models/Applicant';
import { Apiauth } from '@/app/middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/lib/redis';
import RabbitMQClient from '@/lib/queue/rabbitmq';
import { QUEUES, RankingJobMessage, calculatePriority } from '@/lib/queue/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
    const { forceRefresh = false } = req.body;
    
    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ error: 'Invalid job ID' });
    }
    
    // Check if ranking is already in progress
    const rankingStatus = await redis.get(`ranking:job:${jobId}:status`);
    if (rankingStatus) {
      const statusData = JSON.parse(rankingStatus);
      if (statusData.status === 'processing' && !forceRefresh) {
        return res.status(202).json({
          message: 'Ranking already in progress',
          ...statusData,
          alreadyInProgress: true
        });
      }
    }
    
    // Check for cached results (unless force refresh requested)
    if (!forceRefresh) {
      const cachedRanking = await redis.get(`ranking:job:${jobId}:results`);
      if (cachedRanking) {
        const { timestamp } = JSON.parse(cachedRanking);
        // If cache is less than 6 hours old, use it
        if (Date.now() - timestamp < 6 * 3600000) {
          return res.status(200).json({
            message: 'Candidates ranked successfully (cached)',
            ...JSON.parse(cachedRanking),
            cacheHit: true
          });
        }
      }
    }
    
    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Count applicants
    const totalApplicants = await Applicant.countDocuments({ jobId });
    if (totalApplicants === 0) {
      return res.status(200).json({
        message: 'No applicants found for this job',
        candidates: [],
        total: 0,
        processed: 0
      });
    }
    
    // Generate task ID
    const taskId = uuidv4();
    
    // Update job document with status
    await Job.findByIdAndUpdate(jobId, {
      rankingStatus: 'in_progress',
      rankingStartedAt: new Date(),
      rankingTaskId: taskId
    });
    
    // Set initial status in Redis
    await redis.set(
      `ranking:job:${jobId}:status`,
      JSON.stringify({
        taskId,
        jobId,
        status: 'processing',
        processed: 0,
        total: totalApplicants,
        progress: 0,
        timestamp: Date.now()
      }),
      { EX: 24 * 60 * 60 } // 24 hours expiry
    );
    
    // Connect to RabbitMQ
    const rabbitmq = RabbitMQClient.getInstance();
    await rabbitmq.connect();
    
    // Calculate priority based on applicant count
    const priority = calculatePriority(totalApplicants);
    
    // Create ranking job message
    const message: RankingJobMessage = {
      taskId,
      jobId,
      recruiterId: user.userId,
      totalApplicants,
      forceRefresh,
      timestamp: Date.now()
    };
    
    // Send to queue
    await rabbitmq.publishMessage(QUEUES.RESUME_RANKING, message, priority);
    
    return res.status(202).json({
      message: 'Ranking process started',
      taskId,
      jobId,
      total: totalApplicants,
      status: 'processing',
      timestamp: Date.now()
    });
    
  } catch (error: any) {
    console.error('Error starting ranking process:', error);
    
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}