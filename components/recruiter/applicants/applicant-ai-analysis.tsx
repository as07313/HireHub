'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

interface ApplicantAIAnalysisProps {
  applicant: any;
}

// Mock AI analysis - Replace with actual API data
const aiAnalysis = {
  matching_analysis: {
    technical_skills: {
      score: 92,
      strengths: ["Strong React expertise", "Advanced TypeScript knowledge"],
      gaps: ["Limited Python experience"]
    },
    experience_fit: {
      score: 88,
      strengths: ["Relevant industry experience", "Leadership roles"],
      gaps: ["Shorter tenure in current role"]
    },
    culture_fit: {
      score: 95,
      strengths: ["Collaborative approach", "Problem-solving mindset"],
      gaps: []
    }
  },
  description: "Strong candidate with exceptional technical skills and leadership experience. Cultural alignment is particularly notable.",
  score: 85,
  recommendation: "Strongly recommended for next stage. Consider fast-tracking for technical interview with senior engineering team."
};

export function ApplicantAIAnalysis({ applicant }: ApplicantAIAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI Analysis</h2>
      </div>

      <Card className="p-6 bg-primary/5 border-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Overall Match</h3>
            <p className="text-sm text-muted-foreground">Based on job requirements</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{aiAnalysis.score}%</p>
          </div>
        </div>
        <Progress value={aiAnalysis.score} className="h-2" />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(aiAnalysis.matching_analysis).map(([key, analysis]) => (
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
            {Object.entries(aiAnalysis.matching_analysis).map(([category, analysis]) => 
                analysis.strengths.map((strength) => (
                  <li 
                    key={`${category}-strength-${strength}`} 
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
            {Object.entries(aiAnalysis.matching_analysis).map(([category, analysis]) => 
                analysis.gaps.map((gap) => (
                  <li 
                    key={`${category}-gap-${gap}`} 
                    className="text-sm text-muted-foreground list-disc"
                  >
                    {gap}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">AI Recommendation</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              {aiAnalysis.recommendation}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}