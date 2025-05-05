import fs from 'fs';
import FormData from 'form-data';
import { ResumeProcessingMessage } from '../auto-ranking';
import { Resume } from '../../../models/Resume';
import { Applicant } from '../../../models/Applicant';
import { logInfo, logError } from '../../logger';
import redis from '../../redis';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

interface ParsedResumeData {
  Name?: string;
  Summary?: string;
  'Contact Information'?: string;
  Education?: any[];
  'Work Experience'?: any[];
  Skills?: string[];
  metadata?: Record<string, any>;
  error?: string; 
}

const PYTHON_PARSER_URL = process.env.PYTHON_PARSER_URL || 'http://localhost:8000/parse-resume'; // Use env var


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
  let parsedData: ParsedResumeData | null = null;
  let parsingError: string | null = null;
  
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

    // --- Start: Call Python Parser ---
    try {
      logInfo(`Calling Python parser for resume ${resumeId}`);
      await updateResumeStatus(resumeId, taskId, 'processing', 20, 'Parsing with OpenAI'); // Update progress

      const fileStream = fs.createReadStream(resume.filePath);
      const formData = new FormData();
      formData.append('file', fileStream, { filename: resume.fileName });

      const parseResponse = await axios.post<ParsedResumeData>(PYTHON_PARSER_URL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000, // 60 second timeout for parsing
      });

      if (parseResponse.status === 200) {
          //console.log("parseResponse", parseResponse)
          parsedData = parseResponse.data;
          console.log("parsedData", parsedData)
          logInfo(`Successfully parsed resume ${resumeId} with Python parser.`);
          // Check if the parser itself returned an error message within the JSON
      } else {
          parsingError = `Python parser returned status ${parseResponse.status}`;
          logError(parsingError);
      }
    } 
    catch (err: any) {
      parsingError = `Failed to call Python parser: ${err.message || err}`;
      logError(`Error calling Python parser for ${resumeId}:`, err);
      // Decide if this error is fatal for the whole process or just log and continue
      // For now, we'll log it and store the error, but continue with LlamaCloud
    }
    // --- End: Call Python Parser ---


    
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
    let llamaError = null;
    
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
        
        if (llamaResponse.ok) {
          llamaError = null;
          logInfo("Successfully sent resume to LlamaCloud API");
          break;
        }

        const errorText = await llamaResponse.text();
        llamaError = `LlamaCloud API returned status ${llamaResponse.status}: ${errorText}`;
        logError(`${llamaError} (Attempt ${retries + 1}/3)`);        
        retries++;
        if (retries >= 2) break; 
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      } 
      
      catch (error: any) {
        llamaError = `Network error: ${error.message || error}`;
        logError(`${llamaError} (Attempt ${retries + 1}/3)`);
        if (retries >= 2) throw error;
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    if (!llamaResponse || !llamaResponse.ok) {
      logError(`Final LlamaCloud processing failed for ${resumeId}: ${llamaError}`);

      const error = await llamaResponse?.text() || 'Failed to contact LlamaCloud API';
      throw new Error(`LlamaCloud API error: ${error}`);
    }
    else {
      logInfo(`LlamaCloud processed resume ${resumeId} successfully`);


    }
    
    // Update status to parsing
    await updateResumeStatus(resumeId, taskId, 'processing', 60);
    
    // Parse response
    //const responseData = await llamaResponse.json();
    logInfo(`LlamaCloud processed resume ${resumeId} successfully`);
        
    // Update status to storing
    await updateResumeStatus(resumeId, taskId, 'processing', 80);
    
    // Determine final status based on errors
    const finalProcessingStatus = llamaError || parsingError ? 'error' : 'completed';
    const finalStatus = finalProcessingStatus === 'error' ? 'error' : 'completed';
    const combinedError = [parsingError, llamaError].filter(Boolean).join('; ');

    await Resume.findByIdAndUpdate(resumeId, {
      status: finalStatus,
      processingStatus: finalProcessingStatus,
      parsedData: parsedData, 
      processingError: combinedError || undefined, 
      lastModified: new Date()
    });

    // Update applicant only if the overall process didn't have critical errors (adjust as needed)
    if (finalProcessingStatus === 'completed' && applicantId !== 'direct-upload') {
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