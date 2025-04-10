import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '../mongodb';
import { Resume } from '../../models/Resume';
import { Job } from '../../models/Job';
import { logInfo, logError } from '../logger';
import { Applicant } from '../../models/Applicant';
import RabbitMQClient from './rabbitmq';
import redis from '../redis';

// Queue names
const QUEUES = {
  RESUME_PROCESSING: 'resume-processing',
  RESUME_STATUS: 'resume-status'
};

// Define message types
export interface ResumeProcessingMessage {
  taskId: string;
  resumeId: string;
  fileName: string;
  jobId: string;
  applicantId: string;
  candidateId: string;
  priority: number;
  timestamp: number;
}

/**
 * Queue a resume for processing with LlamaCloud
 */
export async function queueApplicationForRanking(jobId: string, applicantId: string, resumeId: string) {
  try {
    await connectToDatabase();
    
    // Fetch the resume to get necessary details
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      logError(`Resume not found: ${resumeId}`);
      return;
    }

    if (resume.processingStatus === 'completed') {
      logInfo(`Resume ${resumeId} already processed, skipping processing`);
      
      // Update the applicant to mark the resume as processed
      if (applicantId) {
        await Applicant.findByIdAndUpdate(applicantId, {
          resumeProcessed: true,
          resumeProcessedAt: new Date()
        });
      }
      
      // Return the existing task ID if available
      const processingInfo = await redis.get(`resume:processing:${resumeId}`);
      if (processingInfo) {
        const parsed = JSON.parse(processingInfo);
        return parsed.taskId;
      }
      
      // If no task ID in Redis, generate a new one for tracking
      return uuidv4();
    }
    
    // Generate task ID
    const taskId = uuidv4();
    
    // Update resume status to "queued" in database
    await Resume.findByIdAndUpdate(resumeId, {
      processingStatus: 'queued',
      lastModified: new Date()
    });
    
    // Store processing status in Redis
    await redis.set(
      `resume:processing:${resumeId}`,
      JSON.stringify({
        taskId,
        status: 'queued',
        progress: 0,
        timestamp: Date.now()
      }),
      { EX: 24 * 60 * 60 } // 24 hours expiry
    );
    
    // Calculate priority
    // Use higher priority for smaller jobs to optimize processing
    const priority = 5; // Medium priority
    
    // Create message for queue
    const message: ResumeProcessingMessage = {
      taskId,
      resumeId,
      fileName: resume.fileName,
      jobId,
      applicantId,
      candidateId: resume.candidateId.toString(),
      priority,
      timestamp: Date.now()
    };
    
    // Connect to RabbitMQ and publish the message
    const rabbitmq = RabbitMQClient.getInstance();
    await rabbitmq.connect();
    await rabbitmq.publishMessage(QUEUES.RESUME_PROCESSING, message, priority);
    
    logInfo(`Resume ${resumeId} queued for processing (task: ${taskId})`);
    
    return taskId;
  } catch (error) {
    logError('Error queueing resume for processing:', error);
    throw error;
  }
}