// hooks/use-jobs.ts
import { useState, useEffect } from 'react'

interface Job {
  _id: string
  title: string
  company: string
  logo: string
  location: string
  salary: {
    min: string
    max: string
  }
  employmentType: string
  workplaceType: string
  experience: string
  postedDate: Date
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      
      const data = await response.json()
      setJobs(data)
      setError(null)
    } catch (error) {
      setError('Failed to fetch jobs')
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return { jobs, loading, error, refetch: fetchJobs }
}