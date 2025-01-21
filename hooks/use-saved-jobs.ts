// hooks/use-saved-jobs.ts
import { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  employmentType: string;
  workplaceType: string;
  experience: string;
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch saved jobs');
      }

      const data = await response.json();
      setSavedJobs(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch saved jobs');
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
      console.log(savedJobs)
  };

  const saveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      //console.log(token)
      const response = await fetch('/api/jobs/saved', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      await fetchSavedJobs();
      setError(null);
    } catch (error) {
      setError('Failed to save job');
      console.error('Error saving job:', error);
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/saved?jobId=${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove job');
      }

      await fetchSavedJobs();
      setError(null);
    } catch (error) {
      setError('Failed to remove job');
      console.error('Error removing job:', error);
    }
  };

  return { 
    savedJobs, 
    loading, 
    error,
    saveJob, 
    removeJob,
    isSaved: (jobId: string) => savedJobs.some(job => job.id === jobId)
  };
}