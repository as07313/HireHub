export const QUEUES = {
  RESUME_RANKING: 'resume-ranking',
  RANKING_STATUS: 'ranking-status',
  DEAD_LETTER: 'resume-ranking-dead-letter'
};

export const EXCHANGES = {
  RETRY: 'ranking-retry'
};

export const ROUTING_KEYS = {
  RANKING: 'ranking'
};

// Queue message types
export interface RankingJobMessage {
  taskId: string;
  jobId: string;
  recruiterId: string;
  totalApplicants: number;
  forceRefresh: boolean;
  timestamp: number;
}

export interface StatusUpdateMessage {
  taskId: string;
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  processed: number;
  total: number;
  progress: number;
  timestamp: number;
  error?: string;
}

// Priority levels for ranking jobs
export enum Priority {
  LOW = 1,       // >100 applicants
  NORMAL = 5,    // 50-100 applicants
  HIGH = 8,      // 10-50 applicants
  CRITICAL = 10  // <10 applicants
}

// Helper function to calculate priority based on applicant count
export function calculatePriority(applicantCount: number): Priority {
  if (applicantCount <= 10) return Priority.CRITICAL;
  if (applicantCount <= 50) return Priority.HIGH;
  if (applicantCount <= 100) return Priority.NORMAL;
  return Priority.LOW;
}