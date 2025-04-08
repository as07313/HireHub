import fs from 'fs';
import FormData from 'form-data';
//import fetch from 'node-fetch';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ResumeProcessingMessage } from '../auto-ranking';
import connectToDatabase from '../../mongodb';
import { Resume } from '../../../models/Resume';
import { Applicant } from '../../../models/Applicant';
import { logInfo, logError } from '../../logger';
import redis from '../../redis';

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
 * Process a resume from the queue
 */
export async function processResumeFromQueue(message: ResumeProcessingMessage): Promise<void> {
  const { taskId, resumeId, applicantId, jobId } = message;
  
  try {
    logInfo(`Processing resume ${resumeId} for application ${applicantId}`);
    
    // Connect to database
    await connectToDatabase();
    
    // Update status to processing
    await updateResumeStatus(resumeId, 'processing', 10);
    
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
    await updateResumeStatus(resumeId, 'processing', 30);
    // const { default: fetch } = await import('node-fetch');
    // Create form data for LlamaCloud API
    const formData = new FormData();
    const fileStream = fs.createReadStream(resume.filePath);
    formData.append('files', fileStream, { 
      filename: resume.fileName || 'resume.pdf'
    });
    
    // Send to LlamaCloud API
    const llamaResponse = await fetch(
      'https://hirehub-api-795712866295.europe-west4.run.app/api/upload', 
      {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders()
      }
    );
    
    // Update status to parsing
    await updateResumeStatus(resumeId, 'processing', 60);
    
    if (!llamaResponse.ok) {
      const error = await llamaResponse.text();
      throw new Error(`LlamaCloud API error: ${error}`);
    }
    
    // Parse response
    const responseData = await llamaResponse.json();
    logInfo(`LlamaCloud processed resume ${resumeId} successfully`);
    
    // Extract the parsed content
    //const parsedContent = responseData.results[0]?.parsed_content || '';
    
    // Update status to storing
    await updateResumeStatus(resumeId, 'processing', 80);
    
    // Store the parsed content in S3
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
    await Applicant.findByIdAndUpdate(applicantId, {
      resumeProcessed: true,
      resumeProcessedAt: new Date()
    });
    
    // Update final status
    await updateResumeStatus(resumeId, 'completed', 100);
    
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
      await redis.set(
        `resume:processing:${resumeId}`,
        JSON.stringify({
          taskId,
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }),
        { EX: 24 * 60 * 60 } // 24 hours expiry
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
async function updateResumeStatus(resumeId: string, status: string, progress: number): Promise<void> {
  try {
    const statusKey = `resume:processing:${resumeId}`;
    
    // Get existing status
    const existingStatus = await redis.get(statusKey);
    let taskId = '';
    
    if (existingStatus) {
      const parsed = JSON.parse(existingStatus);
      taskId = parsed.taskId;
    }
    
    // Update status
    await redis.set(
      statusKey,
      JSON.stringify({
        taskId,
        status,
        progress,
        timestamp: Date.now()
      }),
      { EX: 24 * 60 * 60 } // 24 hours expiry
    );
  } catch (error) {
    logError(`Failed to update resume status in Redis:`, error);
  }
}