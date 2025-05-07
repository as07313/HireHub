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

const categoryWeightages: Record<string, number> = {
  technical_skills: 40,
  experience: 30,
  education: 15,
};

export function ApplicantAIAnalysis({ applicant }: ApplicantAIAnalysisProps) {
  // Check if AI analysis data exists
  console.log("applicant in component", applicant);
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
                The Job Fit Score is determined by GPT 4o model analyzing the candidate's resume against the job description.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li><strong>Technical Skills:</strong> Out of 40 %</li>
                <li><strong>Experience:</strong> Out of 30 %</li>
                <li><strong>Education:</strong> Out of 15 %</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                The model also provides scores for each category, along with identified strengths and areas for improvement. The total score reflects the overall alignment.
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
  console.log("AI Analysis data", aiAnalysis);
    
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
                The Job Fit Score is determined by GPT 4o model analyzing the candidate's resume against the job description.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li><strong>Technical Skills:</strong> Out of 40 %</li>
                <li><strong>Experience:</strong> Out of 30 %</li>
                <li><strong>Education:</strong> Out of 15 %</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                The AI provides scores for each category, along with identified strengths and areas for improvement. The total score reflects the overall alignment.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(analysisData).map(([key, analysis]) => {
          const maxScore = categoryWeightages[key.toLowerCase()] || 100; // Default to 100 if key not found
          const scaledValue = (analysis.score / maxScore) * 100;
          return (
            <Card key={key} className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                <Progress value={scaledValue} className="h-1.5" />
                <p className="text-sm font-medium">{analysis.score}% Match (out of {maxScore}%)</p>
              </div>
            </Card>
          );
        })}
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
          <div>
          </div>
        </div>
      </Card>
    </div>
  );
}
