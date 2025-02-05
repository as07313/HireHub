'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  ExternalLink 
} from "lucide-react";

interface SkillsRecommendationProps {
  jobSkills:  string[];
  candidateSkills:  string[];
}

interface SkillGap {
  skill: string;
  proficiency: number;
  importance: number;
  resources: {
    title: string;
    platform: string;
    url: string;
    duration: string;
  }[];
}

// Mock data - Replace with actual API data
const getSkillsAnalysis = (jobSkills:  string[], candidateSkills:  string[]) => {
  return {
    matchingSkills: [
      {
        skill: "React",
        proficiency: 90,
        strength: "Strong foundation in React development",
      },
      {
        skill: "TypeScript",
        proficiency: 85,
        strength: "Good TypeScript knowledge",
      },
    ],
    skillGaps: [
      {
        skill: "GraphQL",
        proficiency: 30,
        importance: 80,
        resources: [
          {
            title: "GraphQL Fundamentals",
            platform: "Udemy",
            url: "https://udemy.com/graphql-course",
            duration: "8 hours",
          },
          {
            title: "Advanced GraphQL with React",
            platform: "Frontend Masters",
            url: "https://frontendmasters.com/graphql-advanced",
            duration: "6 hours",
          },
        ],
      },
      {
        skill: "AWS",
        proficiency: 40,
        importance: 75,
        resources: [
          {
            title: "AWS for Frontend Developers",
            platform: "Pluralsight",
            url: "https://pluralsight.com/aws-frontend",
            duration: "10 hours",
          },
        ],
      },
    ],
    overallMatch: 75,
    recommendation: "Focus on strengthening GraphQL and AWS skills to increase job match potential. Consider completing the recommended courses to enhance your profile.",
  };
};

export function SkillsRecommendation({ jobSkills, candidateSkills }: SkillsRecommendationProps) {
  const analysis = getSkillsAnalysis(jobSkills, candidateSkills);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Skills Enhancement Recommendations</h2>
      </div>

      {/* Overall Match */}
      <Card className="p-6 bg-primary/5 border-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Skills Match Score</h3>
            <p className="text-sm text-muted-foreground">Based on job requirements</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{analysis.overallMatch}%</p>
          </div>
        </div>
        <Progress value={analysis.overallMatch} className="h-2" />
      </Card>

      {/* Matching Skills */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Strong Skills</h3>
          </div>
          <div className="grid gap-4">
            {analysis.matchingSkills.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-green-600">{skill.proficiency}%</span>
                </div>
                <Progress value={skill.proficiency} className="h-1.5" />
                <p className="text-sm text-muted-foreground">{skill.strength}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Skill Gaps */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Skills to Develop</h3>
          </div>
          <div className="grid gap-6">
            {analysis.skillGaps.map((gap) => (
              <div key={gap.skill} className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{gap.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Current:</span>
                      <span className="text-yellow-600">{gap.proficiency}%</span>
                    </div>
                  </div>
                  <Progress value={gap.proficiency} className="h-1.5" />
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Recommended Resources</h4>
                  <div className="grid gap-3">
                    {gap.resources.map((resource, index) => (
                      <div key={index} className="flex items-start justify-between gap-4 text-sm">
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-muted-foreground">
                            {resource.platform} • {resource.duration}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Course
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Recommendation */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">AI Recommendation</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {analysis.recommendation}
        </p>
      </Card>
    </div>
  );
}