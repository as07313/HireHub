import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Resume } from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import redis from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    // Authenticate request
    const user = await Apiauth(req, res);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid resume ID' });
    }
    
    // Check Redis first for real-time status
    const statusKey = `resume:processing:${id}`;
    const processingStatus = await redis.get(statusKey);
    
    if (processingStatus) {
      return res.status(200).json(JSON.parse(processingStatus));
    }
    
    // If not in Redis, get from database
    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Return status based on database state
    return res.status(200).json({
      status: resume.processingStatus || 'unknown',
      progress: resume.processingStatus === 'completed' ? 100 : 0,
      timestamp: resume.lastModified?.getTime() || Date.now(),
      error: resume.processingError
    });
    
  } catch (error) {
    console.error('Error fetching resume processing status:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}