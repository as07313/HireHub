import fs from 'fs';
import FormData from 'form-data';
import { ResumeProcessingMessage } from '../auto-ranking';
import connectToDatabase from '../../mongodb';
import { Resume } from '../../../models/Resume';
import { Applicant } from '../../../models/Applicant';
import { logInfo, logError } from '../../logger';
import redis from '../../redis';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// S3 configuration
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  },
  forcePathStyle: true
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'fypbucket';
const PARSED_FOLDER = 'parsed';

/**
 * Process a batch of resumes concurrently
 */
export async function processBatchOfResumes(batch: ResumeProcessingMessage[]): Promise<void> {
  if (!batch.length) return;
  
  logInfo(`Processing batch of ${batch.length} resumes`);
  
  // Process all resumes in the batch concurrently using Promise.allSettled
  const results = await Promise.allSettled(
    batch.map(message => processResumeInBatch(message))
  );
  
  // Log statistics
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  logInfo(`Batch processing completed: ${successful} succeeded, ${failed} failed`);
}

/**
 * Process a single resume as part of a batch
 */
async function processResumeInBatch(message: ResumeProcessingMessage): Promise<void> {
  const { taskId, resumeId, applicantId, jobId } = message;
  
  try {
    logInfo(`Batch processing resume ${resumeId} for application ${applicantId}`);
    
    // Update status to processing
    await updateResumeStatus(resumeId, taskId, 'processing', 10);
    
    // Find the resume with all fields including filePath
    const resume = await Resume.findById(resumeId).select('+filePath');
    
    if (!resume) {
      throw new Error(`Resume ${resumeId} not found`);
    }
    
    if (!resume.filePath) {
      throw new Error(`Resume ${resumeId} has no file path`);
    }
    
    // Check if file exists
    if (!fs.existsSync(resume.filePath)) {
      throw new Error(`Resume file ${resume.filePath} does not exist`);
    }
    
    // Update status to uploading
    await updateResumeStatus(resumeId, taskId, 'processing', 30);
    
    // Dynamically import fetch to avoid ESM issues
    const { default: fetch } = await import('node-fetch');
    
    // Create form data for LlamaCloud API
    const formData = new FormData();
    const fileStream = fs.createReadStream(resume.filePath);
    formData.append('files', fileStream, { 
      filename: resume.fileName || 'resume.pdf'
    });
    
    // Send to LlamaCloud API with retry mechanism
    let retries = 0;
    let llamaResponse;
    
    while (retries < 3) {
      try {
        llamaResponse = await fetch(
          'https://hirehub-api-795712866295.europe-west4.run.app/api/upload', 
          {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
          }
        );
        
        if (llamaResponse.ok) break;
        
        retries++;
        logInfo(`Retry ${retries}/3 for resume ${resumeId}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      } catch (error) {
        if (retries >= 2) throw error;
        retries++;
        logInfo(`Network error, retry ${retries}/3 for resume ${resumeId}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    if (!llamaResponse || !llamaResponse.ok) {
      const error = await llamaResponse?.text() || 'Failed to contact LlamaCloud API';
      throw new Error(`LlamaCloud API error: ${error}`);
    }
    
    // Update status to parsing
    await updateResumeStatus(resumeId, taskId, 'processing', 60);
    
    // Parse response
    const responseData = await llamaResponse.json();
    logInfo(`LlamaCloud processed resume ${resumeId} successfully`);
    
    // Extract the parsed content (uncomment if needed)
    // const parsedContent = responseData.results[0]?.parsed_content || '';
    
    // Update status to storing
    await updateResumeStatus(resumeId, taskId, 'processing', 80);
    
    // Store the parsed content in S3 (uncomment if needed)
    // if (parsedContent) {
    //   const mdFileName = `${PARSED_FOLDER}/${resume.fileName.replace(/\.[^/.]+$/, "")}.md`;
    //   await s3Client.send(new PutObjectCommand({
    //     Bucket: BUCKET_NAME,
    //     Key: mdFileName,
    //     Body: parsedContent,
    //     ContentType: 'text/markdown'
    //   }));
    //   logInfo(`Stored parsed resume in S3: ${mdFileName}`);
    // }
    
    // Update resume with parsed data
    await Resume.findByIdAndUpdate(resumeId, {
      status: 'completed',
      processingStatus: 'completed',
      lastModified: new Date()
    });
    
    // Update applicant to mark resume as processed
    if (applicantId !== 'direct-upload') {
      await Applicant.findByIdAndUpdate(applicantId, {
        resumeProcessed: true,
        resumeProcessedAt: new Date()
      });
    }
    
    // Update final status
    await updateResumeStatus(resumeId, taskId, 'completed', 100);
    
    logInfo(`Successfully processed resume ${resumeId}`);
    
  } catch (error) {
    logError(`Error processing resume ${resumeId}:`, error);
    
    // Update resume with error status
    try {
      await Resume.findByIdAndUpdate(resumeId, {
        status: 'error',
        processingStatus: 'error',
        lastModified: new Date(),
        processingError: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Update status in Redis
      await updateResumeStatus(
        resumeId, 
        taskId, 
        'error', 
        0, 
        error instanceof Error ? error.message : 'Unknown error'
      );
    } catch (updateError) {
      logError(`Failed to update resume status:`, updateError);
    }
    
    throw error;
  }
}

/**
 * Update resume processing status in Redis
 */
async function updateResumeStatus(
  resumeId: string, 
  taskId: string, 
  status: string, 
  progress: number, 
  error?: string
): Promise<void> {
  try {
    const statusKey = `resume:processing:${resumeId}`;
    
    // Update status
    await redis.set(
      statusKey,
      JSON.stringify({
        taskId,
        status,
        progress,
        error,
        timestamp: Date.now()
      }),
      { EX: 24 * 60 * 60 } // 24 hours expiry
    );
  } catch (error) {
    logError(`Failed to update resume status in Redis:`, error);
  }
}