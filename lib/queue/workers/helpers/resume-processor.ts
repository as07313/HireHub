import axios from 'axios';
import { IApplicant } from '../../../../models/Applicant';
import { logError, logInfo } from '../../../logger';

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
          "https://hirehub-api-795712866295.europe-west4.run.app/api/rank-job-applicants",
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