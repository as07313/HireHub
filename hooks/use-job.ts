// hooks/use-job.ts
import { useState, useEffect } from 'react';
import { BaseJob } from '@/app/types/job';

interface JobWithStats extends BaseJob {
  applicantStats: {
    total: number;
    qualified: number;
    interviewing: number;
    hired: number;
  }
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/recruiter', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      setError('Failed to fetch jobs');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: fetchJobs };
}