"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDownUp, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface RankingButtonProps {
  jobId: string
  onRankingStart: () => void
  onRankingComplete: () => void
  hasRankingResults: boolean
  disabled?: boolean
}

export function RankingButton({
  jobId,
  onRankingStart,
  onRankingComplete,
  hasRankingResults,
  disabled = false
}: RankingButtonProps) {
  const [isRanking, setIsRanking] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  // Poll for status updates when ranking is in progress
  useEffect(() => {
    if (!isRanking || !taskId) return
    
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/ranking-status`)
        if (!response.ok) {
          throw new Error('Failed to fetch ranking status')
        }
        
        const data = await response.json()
        
        if (data.status === 'completed') {
          setIsRanking(false)
          clearInterval(intervalId)
          toast.success('Candidates ranked successfully!')
          onRankingComplete()
        } else if (data.status === 'failed') {
          setIsRanking(false)
          clearInterval(intervalId)
          toast.error(`Ranking failed: ${data.error || 'Unknown error'}`)
        } else if (data.status === 'processing') {
          setProgress(data.progress || 0)
        }
      } catch (error) {
        console.error('Error checking ranking status:', error)
      }
    }, 3000)
    
    return () => clearInterval(intervalId)
  }, [isRanking, taskId, jobId, onRankingComplete])
  
  // Start ranking process
  const startRanking = async () => {
    try {
      setIsRanking(true)
      onRankingStart()
      
      const response = await fetch(`/api/jobs/${jobId}/rank-candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forceRefresh: hasRankingResults // Force refresh if already ranked
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start ranking process')
      }
      
      const data = await response.json()
      
      if (data.cacheHit) {
        // Cached results available - no need to wait
        setIsRanking(false)
        toast.success('Using recent ranking results')
        onRankingComplete()
        return
      }
      
      if (data.alreadyInProgress) {
        toast.info('Ranking already in progress')
      } else {
        toast.info('Ranking process started')
      }
      
      setTaskId(data.taskId)
      
    } catch (error: any) {
      setIsRanking(false)
      toast.error(error.message || 'Failed to start ranking')
    }
  }
  
  return (
    <Button 
      onClick={startRanking}
      disabled={disabled || isRanking}
      variant={hasRankingResults ? "outline" : "default"}
    >
      {isRanking ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {progress > 0 ? `Ranking... ${progress}%` : 'Starting ranking...'}
        </>
      ) : hasRankingResults ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-rank Candidates
        </>
      ) : (
        <>
          <ArrowDownUp className="mr-2 h-4 w-4" />
          Rank Candidates
        </>
      )}
    </Button>
  )
}