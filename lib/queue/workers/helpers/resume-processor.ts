import axios from 'axios';
import { IApplicant } from '../../../../models/Applicant';
import { logError, logInfo } from '../../../logger';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { streamToString } from '../../utils/stream'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  },
  forcePathStyle: true
});

// S3 bucket configuration
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'fypbucket';
const PARSED_FOLDER = 'parsed';

interface ResumeData {
  candidateId: string;
  name: string;
  content: string;
  metadata: {
    skills: string[];
    experience: string;
    applicantId: string;
  };
}

interface RankingBatchRequest {
  job_description: string;
  requirements: string[];
  skills: string[];
  resumes: ResumeData[];
}

interface RankingResult {
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
  education_strengths: string[];
  education_gaps: string[];
  analysis: string;
}

interface RankingResponse {
  results: RankingResult[];
}

export class ResumeProcessor {
  /**
   * Prepares resumes for batch processing
   */
  private static async fetchResumeFromS3(fileName: string): Promise<string> {
    try {
      // Transform the original filename to the markdown format in the parsed folder
      const mdFileName = `${PARSED_FOLDER}/${fileName.replace(/\.[^/.]+$/, "")}.md`;
      
      logInfo(`Fetching resume from S3: ${mdFileName}`);
      
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: mdFileName
      });
      
      const response = await s3Client.send(command);
      
      if (!response.Body) {
        throw new Error(`Empty response body for file: ${mdFileName}`);
      }
      
      // Convert stream to string
      const resumeContent = await streamToString(response.Body);
      return resumeContent;
      
    } catch (error) {
      logError(`Error fetching resume from S3:`, error);
      // Return empty string if file not found, allowing the process to continue
      return '';
    }
  }
  public static async prepareResumeBatchFromS3(applicants: any[]): Promise<ResumeData[]> {
    // Process applicants in parallel to improve performance
    const resumePromises = applicants.map(async (app) => {
      let content = '';
      
      // Get original filename from resumeId
      const fileName = app.resumeId?.fileName;
      
      if (fileName) {
        // Fetch the content from S3
        content = await this.fetchResumeFromS3(fileName);
      }
      
      // If S3 fetch fails, fall back to database parsedData as a backup
      if (!content && app.resumeId?.parsedData) {
        logInfo(`Using fallback parsedData for ${app.candidateId._id.toString()}`);
        
        // If parsedData is an object, convert it to a string representation
        if (typeof app.resumeId.parsedData === 'object') {
          content = JSON.stringify(app.resumeId.parsedData);
        } else {
          content = app.resumeId.parsedData;
        }
      }
      
      return {
        candidateId: app.candidateId._id.toString(),
        name: app.candidateId.fullName || 'Unnamed Candidate',
        content: content, // Use S3 content or fallback
        metadata: {
          skills: app.candidateId.skills || [],
          experience: app.candidateId.experience || '',
          applicantId: app._id.toString()
        }
      };
    });
    
    // Wait for all fetches to complete
    return Promise.all(resumePromises);
  }

  // Keep the original method as a fallback
  public static prepareResumeBatch(applicants: any[]): ResumeData[] {
    return applicants.map(app => ({
      candidateId: app.candidateId._id.toString(),
      name: app.candidateId.fullName || 'Unnamed Candidate',
      content: app.resumeId?.parsedData || '',
      metadata: {
        skills: app.candidateId.skills || [],
        experience: app.candidateId.experience || '',
        applicantId: app._id.toString()
      }
    }));
  }



  /**
   * Calls AI service to rank resumes with exponential backoff retry
   */
  public static async rankResumes(
    batchData: RankingBatchRequest,
    maxAttempts: number = 3
  ): Promise<RankingResult[]> {
    let attempt = 0;
    let lastError;

    while (attempt < maxAttempts) {
      try {
        logInfo(`Ranking attempt ${attempt + 1} for ${batchData.resumes.length} resumes`);
        
        // Calculate dynamic timeout based on batch size
        const timeout = 30000 + (batchData.resumes.length * 5000); // Base + 5s per resume
        
        const response = await axios.post<RankingResponse>(
          `${process.env.LOCAL_URL}/api/rank-job-applicants`,
          batchData,
          {
            headers: { "Content-Type": "application/json" },
            timeout
          }
        );
        
        if (response.data && response.data.results) {
          return response.data.results;
        }
        
        throw new Error('Invalid response structure from ranking API');
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        // Log the error but continue retrying
        logError(`Error in ranking attempt ${attempt}/${maxAttempts}:`, error.message || error);
        
        if (attempt >= maxAttempts) break;
        
        // Exponential backoff
        const delay = 2000 * Math.pow(2, attempt);
        logInfo(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('Failed to rank resumes after multiple attempts');
  }

  /**
   * Convert ranking results to applicant updates
   */
  public static mapResultsToApplicantUpdates(results: RankingResult[]): any[] {
    return results.map(result => ({
      candidateId: result.candidateId,
      updates: {
        jobFitScore: result.total_score,
        aiAnalysis: {
          technicalSkills: {
            score: result.technical_score,
            strengths: result.technical_strengths || [],
            gaps: result.technical_gaps || []
          },
          experience: {
            score: result.experience_score,
            strengths: result.experience_strengths || [],
            gaps: result.experience_gaps || []
          },
          education: {
            score: result.education_score,
            strengths: result.education_strengths || [],
            gaps: result.education_gaps || []
          }
        }
      }
    }));
  }
}