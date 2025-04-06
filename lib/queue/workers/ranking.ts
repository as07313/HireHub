import { logInfo, logError } from '../../logger';
import connectToDatabase from '../../mongodb';
import { Job } from '../../../models/Job';
import { Applicant } from '../../../models/Applicant';
import { Resume } from '../../../models/Resume';
import { Candidate } from '../../../models/User'; // Add this import
import { RankingJobMessage, StatusUpdateMessage, QUEUES } from '../config';
import { ResumeProcessor } from './helpers/resume-processor';
import redis from '../../redis';
import RabbitMQClient from '../rabbitmq';

// Define an interface for ranking results based on what ResumeProcessor actually returns
interface RankingResult {
  candidate_id: string;
  total_score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  soft_skills_score: number;
  strengths: string[];
  improvement_areas: string[];
  analysis: string;
}

// Define the ProcessorResult interface to match what ResumeProcessor.rankResumes() returns
interface ProcessorResult {
  candidateId: string;
  name: string;
  total_score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  soft_skills_score: number;
  technical_strengths: string[];
  technical_gaps: string[];
  experience_strengths: string[];
  experience_gaps: string[];
  analysis: string;
}

/**
 * Process ranking job from queue
 */
export async function processRankingJob(message: RankingJobMessage): Promise<void> {
  const { taskId, jobId, recruiterId, totalApplicants, forceRefresh } = message;
  
  try {
    logInfo(`Starting ranking job ${taskId} for job ${jobId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Update status to started
    await updateRankingStatus({
      taskId,
      jobId,
      status: 'processing',
      processed: 0,
      total: totalApplicants,
      progress: 0,
      timestamp: Date.now()
    });
    
    // Get job details first
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    // Update job status in DB
    await Job.findByIdAndUpdate(jobId, {
      rankingStatus: 'in_progress',
      rankingStartedAt: new Date(),
      rankingTaskId: taskId
    });
    
    // Process in batches
    const BATCH_SIZE = 10; // Process 10 resumes at a time
    let processedCount = 0;
    let allResults: RankingResult[] = [];
    
    // Process applicants in batches
    for (let i = 0; i < totalApplicants; i += BATCH_SIZE) {
      // Fetch a batch of applicants with populated data
      const applicants = await Applicant.find({ jobId })
        .skip(i)
        .limit(BATCH_SIZE)
        .populate({
          path: 'candidateId',
          model: Candidate,
          select: 'fullName email phone skills experience'
        })
        .populate({
          path: 'resumeId',
          model: Resume,
          select: 'fileName filePath uploadDate parsedData'
        })
        .lean();
      
      if (!applicants || applicants.length === 0) continue;
      
      // Process this batch
      try {
        // Prepare batch data
        const batch = await ResumeProcessor.prepareResumeBatchFromS3(applicants);
  
        // Skip empty batches
        if (batch.length === 0) continue;
        
        // Rank resumes - use correct return type
        const processorResults = await ResumeProcessor.rankResumes({
          job_description: job.description,
          requirements: job.requirements || [],
          skills: job.skills || [],
          resumes: batch
        }) as ProcessorResult[];
        
        // Convert processor results to our RankingResult format
        const rankingResults: RankingResult[] = processorResults.map(result => ({
          candidate_id: result.candidateId,
          total_score: result.total_score,
          technical_score: result.technical_score,
          experience_score: result.experience_score,
          education_score: result.education_score,
          soft_skills_score: result.soft_skills_score,
          strengths: [...(result.technical_strengths || []), ...(result.experience_strengths || [])],
          improvement_areas: [...(result.technical_gaps || []), ...(result.experience_gaps || [])],
          analysis: result.analysis
        }));
        
        // Add to overall results
        allResults = [...allResults, ...rankingResults];
        
        // Update applicants with scores - use processorResults directly
        // Cast to any to bypass type checking, or modify mapResultsToApplicantUpdates to accept ProcessorResult[]
        const updates = ResumeProcessor.mapResultsToApplicantUpdates(processorResults as any);
        
        await Promise.all(updates.map(async (update) => {
          const applicant = applicants.find(a => 
            a.candidateId._id.toString() === update.candidateId
          );
          
          if (applicant) {
            await Applicant.findByIdAndUpdate(applicant._id, update.updates);
          }
        }));
        
        // Update progress
        processedCount += batch.length;
        await updateRankingStatus({
          taskId,
          jobId,
          status: 'processing',
          processed: processedCount,
          total: totalApplicants,
          progress: Math.round((processedCount / totalApplicants) * 100),
          timestamp: Date.now()
        });
        
        // Brief pause to prevent overwhelming systems
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        logError(`Error processing batch at offset ${i}:`, error);
        // Continue with next batch despite errors in current batch
      }
    }
    
    // Sort results by score
    allResults.sort((a, b) => b.total_score - a.total_score);
    
    // Cache the results in Redis
    await redis.set(
      `ranking:job:${jobId}:results`,
      JSON.stringify({
        timestamp: Date.now(),
        results: allResults,
        total: totalApplicants,
        processed: processedCount
      }),
      { EX: 24 * 60 * 60 } // Cache for 24 hours
    );
    
    // Update job with completion status
    await Job.findByIdAndUpdate(jobId, {
      rankingStatus: 'completed',
      rankingCompletedAt: new Date(),
      lastRankedAt: new Date()
    });
    
    // Update final status
    await updateRankingStatus({
      taskId,
      jobId,
      status: 'completed',
      processed: processedCount,
      total: totalApplicants,
      progress: 100,
      timestamp: Date.now()
    });
    
    logInfo(`Completed ranking job ${taskId} for job ${jobId}`);
    
  } catch (error: any) {
    logError(`Error in ranking job ${taskId}:`, error);
    
    // Update status to failed
    await updateRankingStatus({
      taskId,
      jobId,
      status: 'failed',
      processed: 0,
      total: totalApplicants,
      progress: 0,
      timestamp: Date.now(),
      error: error.message || 'Unknown error'
    });
    
    // Update job with failure status
    await Job.findByIdAndUpdate(jobId, {
      rankingStatus: 'failed',
      rankingError: error.message || 'Unknown error'
    });
    
    throw error;
  }
}

/**
 * Update status in Redis and publish to status queue
 */
async function updateRankingStatus(status: StatusUpdateMessage): Promise<void> {
  try {
    // Store in Redis
    await redis.set(
      `ranking:job:${status.jobId}:status`,
      JSON.stringify(status),
      { EX: 24 * 60 * 60 } // 24 hours expiry
    );
    
    // Publish to status queue
    const rabbitmq = RabbitMQClient.getInstance();
    await rabbitmq.publishMessage(QUEUES.RANKING_STATUS, status);
  } catch (error) {
    logError('Error updating ranking status:', error);
  }
}