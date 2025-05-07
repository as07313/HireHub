'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle } from "lucide-react"; // Added HelpCircle
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added Tooltip components

interface AnalysisSection {
  score: number;
  strengths: string[];
  gaps: string[];
}

interface AIAnalysis {
  technicalSkills: AnalysisSection;
  experience: AnalysisSection;
  education: AnalysisSection;
}

interface ApplicantAIAnalysisProps {
  applicant: {
    aiAnalysis?: AIAnalysis | null;
  };
}

export function ApplicantAIAnalysis({ applicant }: ApplicantAIAnalysisProps) {
  // Check if AI analysis data exists
  if (!applicant.aiAnalysis) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Analysis</h2>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="w-80 p-3">
                <p className="text-sm font-medium mb-1">Job Fit Score Calculation:</p>
                <p className="text-xs text-muted-foreground mb-2">
                  The Job Fit Score is determined by an AI model (GPT) analyzing the candidate's resume against the job description.
                </p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li><strong>Technical Skills:</strong> Up to 40 points</li>
                  <li><strong>Experience:</strong> Up to 30 points</li>
                  <li><strong>Education:</strong> Up to 15 points</li>
                  <li><strong>Soft Skills:</strong> Up to 15 points</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  The AI provides scores for each category, along with identified strengths and areas for improvement. The total score reflects the overall alignment.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No AI analysis data available for this candidate</p>
        </Card>
      </div>
    );
  }

  // Use the actual aiAnalysis data from the applicant prop
  const { aiAnalysis } = applicant;
  
  // Calculate overall score as average of individual scores
  const overallScore = Math.round(
    (aiAnalysis.technicalSkills.score + 
     aiAnalysis.experience.score + 
     aiAnalysis.education.score) / 3
  );
  
  // Create an analysis object with the structure we need for rendering
  const analysisData: Record<string, AnalysisSection> = {
    technical_skills: aiAnalysis.technicalSkills,
    experience: aiAnalysis.experience,
    education: aiAnalysis.education
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI Analysis</h2>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="w-80 p-3">
              <p className="text-sm font-medium mb-1">Job Fit Score Calculation:</p>
              <p className="text-xs text-muted-foreground mb-2">
                The Job Fit Score is determined by an AI model (GPT) analyzing the candidate's resume against the job description.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li><strong>Technical Skills:</strong> Up to 40 points</li>
                <li><strong>Experience:</strong> Up to 30 points</li>
                <li><strong>Education:</strong> Up to 15 points</li>
                <li><strong>Soft Skills:</strong> Up to 15 points</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                The AI provides scores for each category, along with identified strengths and areas for improvement. The total score reflects the overall alignment.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Card className="p-6 bg-primary/5 border-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Overall Match</h3>
            <p className="text-sm text-muted-foreground">Based on job requirements</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{overallScore}%</p>
          </div>
        </div>
        <Progress value={overallScore} className="h-2" />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(analysisData).map(([key, analysis]) => (
          <Card key={key} className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
              <Progress value={analysis.score} className="h-1.5" />
              <p className="text-sm font-medium">{analysis.score}% Match</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Key Strengths</h3>
            </div>
            <ul className="space-y-2 pl-7">
              {Object.entries(analysisData).map(([category, analysis]) => 
                analysis.strengths.map((strength: string, idx: number) => (
                  <li 
                    key={`${category}-strength-${idx}`} 
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {strength}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Areas for Consideration</h3>
            </div>
            <ul className="space-y-2 pl-7">
              {Object.entries(analysisData).map(([category, analysis]) => 
                analysis.gaps.map((gap: string, idx: number) => (
                  <li 
                    key={`${category}-gap-${idx}`} 
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {gap}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Recommendation section based on overall score */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              {getRecommendation(overallScore)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper function to generate recommendation based on score
function getRecommendation(score: number): string {
  if (score >= 85) {
    return "Exceptional candidate match. Strongly recommended for next stage. Consider fast-tracking for interview with hiring team.";
  } else if (score >= 75) {
    return "Strong candidate with good alignment to job requirements. Recommended to proceed to next stage.";
  } else if (score >= 60) {
    return "Moderate match to position. Consider additional screening before proceeding.";
  } else {
    return "Limited alignment with current role requirements. May be better suited for alternative positions.";
  }
}