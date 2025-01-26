// hooks/use-saved-jobs.ts
import { useState, useEffect } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  workplaceType: string;
  experience: string;
  salary: {
    min: string;
    max: string;
  };
  postedDate: Date;
}

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch saved jobs');

      const data = await response.json();
      setSavedJobs(data.savedJobs);
      setError(null);
    } catch (error) {
      setError('Failed to fetch saved jobs');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const saveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      });

      if (!response.ok) throw new Error('Failed to save job');
      
      await fetchSavedJobs();
      setError(null);
    } catch (error) {
      setError('Failed to save job');
      console.error('Error:', error);
    }
  };

  return {
    savedJobs,
    loading,
    error,
    saveJob,
    removeJob: async (id: string) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/jobs/saved?jobId=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to remove job');

        setSavedJobs(prev => prev.filter(job => job.id !== id));
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to remove job');
      }
    },
    isSaved: (id: string) => savedJobs.some(job => job.id === id)
  };
}