'use client';

import { useState } from 'react';
import { SkillsRecommendation } from '@/components/candidate/jobs/skills-recommendation';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components

// Interface for the analysis result data
interface SkillAnalysisResult {
  skill_gaps: { content: string };
  course_recommendations: { content: string };
}

interface SkillAnalysisSectionProps {
  jobId: string;
  jobDescription: string;
  resumeFilePath: string; // The transformed path like 'parsed/filename.md'
}

export function SkillAnalysisSection({
  jobId,
  jobDescription,
  resumeFilePath,
}: SkillAnalysisSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkillAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false); 

  const handleAnalyzeClick = async () => {
    if (!jobId || !jobDescription || !resumeFilePath) {
        setError("Missing required information to perform analysis.");
        setShowAnalysis(true); // Show the error message area
        return;
    }

    setShowAnalysis(true); 
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch(`/api/jobs/${jobId}/analyze-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resumeFilePath }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch analysis (Status: ${response.status})`);
        } else {
          throw new Error(`Unexpected response from server (Status: ${response.status})`);
        }
      }

      const data: SkillAnalysisResult = await response.json();
      setAnalysisResult(data);

    } catch (err: any) {
      console.error("Skill analysis fetch error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showAnalysis && (
        <Card className="p-6 text-center border-dashed border-slate-300 bg-slate-50">
          <h3 className="text-lg font-semibold mb-3">Unlock Your Potential</h3>
          <p className="text-muted-foreground mb-4">
            See how your skills match this job and get personalized recommendations.
          </p>
          <Button onClick={handleAnalyzeClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Skill Gaps'
            )}
          </Button>
        </Card>
      )}

      {showAnalysis && (
        <>
          {isLoading && (
            <Card className="p-6">
              <CardContent className="flex flex-col items-center justify-center space-y-3 min-h-[150px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your skills against the job requirements...</p>
              </CardContent>
            </Card>
          )}

          {error && !isLoading && (
             <Card className="p-6 border-red-200 bg-red-50">
               <CardContent className="flex flex-col items-center text-center space-y-3">
                 <AlertCircle className="h-8 w-8 text-red-500" />
                 <p className="font-medium text-red-700">Analysis Failed</p>
                 <p className="text-sm text-red-600">{error}</p>
                 <Button onClick={handleAnalyzeClick} variant="destructive" size="sm">
                   Retry Analysis
                 </Button>
               </CardContent>
             </Card>
          )}

          {analysisResult && !isLoading && !error && (
            <SkillsRecommendation
              skillGaps={analysisResult.skill_gaps}
              courseRecommendations={analysisResult.course_recommendations}
            />
          )}
        </>
      )}
    </div>
  );
}