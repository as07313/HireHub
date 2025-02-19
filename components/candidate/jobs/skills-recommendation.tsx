'use client';

import { Card } from "@/components/ui/card";
import Link from "next/link";

interface SkillsRecommendationProps {
  skillGaps: {
    content: string;
  };
  courseRecommendations: {
    content: string;
  };
}

const TextWithLinks: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match URLs in markdown-style links and regular URLs
  const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s)]+/g;
  
  // Split the text at URLs while preserving markdown format
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if part matches markdown link format
        const markdownMatch = part.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
        if (markdownMatch) {
          const [_, text, url] = markdownMatch;
          return (
            <Link
              key={index}
              href={url}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </Link>
          );
        }
        
        // Check if part is a regular URL
        if (part.match(/^https?:\/\//)) {
          return (
            <Link
              key={index}
              href={part}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </Link>
          );
        }
        
        // Return regular text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export function SkillsRecommendation({ 
  skillGaps, 
  courseRecommendations 
}: SkillsRecommendationProps) {
  return (
    <div className="space-y-6">
      {/* Skill Gaps Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Skill Gaps</h2>
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
          {skillGaps.content.replace(/\*\*/g, '')}
        </pre>
      </Card>

      {/* Course Recommendations Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Course Recommendations</h2>
        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
          <TextWithLinks text={courseRecommendations.content.replace(/\*\*/g, '')} />
        </div>
      </Card>
    </div>
  );
}