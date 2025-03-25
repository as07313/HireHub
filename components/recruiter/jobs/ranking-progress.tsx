"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface RankingProgressProps {
  jobId: string
}

export function RankingProgress({ jobId }: RankingProgressProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing')
  const [message, setMessage] = useState('Analyzing candidate resumes...')
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/ranking-status`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch ranking status')
        }
        
        const data = await response.json()
        
        if (data.status === 'failed') {
          setStatus('failed')
          setMessage(data.error || 'Ranking failed')
        } else if (data.status === 'completed') {
          setStatus('completed')
          setProgress(100)
          setMessage('Ranking completed successfully!')
        } else {
          setStatus('processing')
          setProgress(data.progress || 0)
          
          // Set appropriate message based on progress
          if (data.progress < 25) {
            setMessage('Analyzing candidate resumes...')
          } else if (data.progress < 50) {
            setMessage('Matching skills to job requirements...')
          } else if (data.progress < 75) {
            setMessage('Evaluating experience and education...')
          } else {
            setMessage('Finalizing candidate rankings...')
          }
        }
      } catch (error) {
        console.error('Error fetching ranking status:', error)
      }
    }
    
    // Fetch immediately
    fetchStatus()
    
    // Then poll every few seconds
    const intervalId = setInterval(fetchStatus, 3000)
    
    return () => clearInterval(intervalId)
  }, [jobId])
  
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4 space-y-2"> 
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600" />
            <p className="text-blue-800 font-medium">AI Ranking in Progress</p>
          </div>
          <span className="text-sm text-blue-800">{progress}%</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <p className="text-sm text-blue-700">{message}</p>
      </CardContent>
    </Card>
  )
}