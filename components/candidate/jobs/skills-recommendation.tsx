'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Lightbulb, BookOpen, GraduationCap, Award, 
  ArrowUpRight, Brain, Star, Zap, CheckCircle 
} from "lucide-react";
import { motion } from "framer-motion";

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
              className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          );
        }
        
        // Check if part is a regular URL
        if (part.match(/^https?:\/\//)) {
          return (
            <Link
              key={index}
              href={part}
              className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          );
        }
        
        // Return regular text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

// Function to extract skill points from the content
const extractSkillPoints = (content: string): string[] => {
  // Look for numbered lists like "1. **Point**" or bulleted lists
  const listRegex = /(?:\d+\.\s|\*\s)(?:\*\*)?([^*\n]+)(?:\*\*)?/g;
  const matches = content.match(listRegex);
  
  if (!matches) return [];
  
  return matches.map(match => 
    match
      .replace(/^\d+\.\s|\*\s/, '') // Remove list markers
      .replace(/\*\*/g, '')         // Remove bold markers
      .trim()
  );
};

// Function to extract courses from recommendations
const extractCourses = (content: string): { title: string, provider?: string, url?: string }[] => {
  const courseRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const courses: { title: string, provider?: string, url?: string }[] = [];
  
  let match;
  while ((match = courseRegex.exec(content)) !== null) {
    const title = match[1];
    const url = match[2];
    
    // Try to extract provider from title
    const providerMatch = title.match(/(.+)\s-\s(.+)/);
    if (providerMatch) {
      courses.push({
        title: providerMatch[1].trim(),
        provider: providerMatch[2].trim(),
        url
      });
    } else {
      courses.push({ title, url });
    }
  }
  
  return courses;
};

export function SkillsRecommendation({ 
  skillGaps, 
  courseRecommendations 
}: SkillsRecommendationProps) {
  // Extract skill points and categorize them
  const skillContent = skillGaps.content;
  const skillPoints = extractSkillPoints(skillContent);
  
  // Extract courses from recommendations
  const courses = extractCourses(courseRecommendations.content);
  
  // Split content into sections based on numbered headers
  const sections = skillContent.split(/\d+\.\s\*\*([^*]+)\*\*/);
  
  return (
    <div className="space-y-6">
      {/* Career Enhancement Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-lg">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Career Enhancement</h2>
      </div>
      
      {/* Skill Gaps Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-0 shadow-md bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Skill Gap Analysis</h2>
          </div>
          
          <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="text-gray-700 italic">
              Based on your resume and the job requirements, here are the key areas where skill development could enhance your profile:
            </p>
          </div>
          
          <div className="space-y-6">
            {sections.length > 1 && sections.map((section, idx) => {
              // Skip the first empty item and every other item (which are the headers)
              if (idx === 0 || idx % 2 === 1) return null;
              
              const title = sections[idx-1];
              const content = section.trim();
              
              return (
                <div key={idx} className="rounded-lg p-5 bg-white border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="px-2 py-1 bg-primary/10 text-primary border-primary/20">
                      {title}
                    </Badge>
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <TextWithLinks text={content} />
                  </div>
                </div>
              );
            })}
            
            {/* If we couldn't parse sections well, use the raw content */}
            {sections.length <= 1 && (
              <div className="whitespace-pre-wrap text-gray-700 space-y-3">
                <TextWithLinks text={skillGaps.content.replace(/\*\*/g, '').replace(/###/g, '')} />
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Course Recommendations Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-0 shadow-md bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">Recommended Learning Paths</h2>
          </div>
          
          <div className="mb-6 rounded-lg bg-indigo-50 p-4 border border-indigo-100">
            <p className="text-gray-700 italic">
              Enhance your skills with these curated courses tailored to bridge your skill gaps:
            </p>
          </div>
          
          {/* Render extracted courses if we have them */}
          {courses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {courses.map((course, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                  className="group"
                >
                  <Link 
                    href={course.url || '#'} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block rounded-lg p-4 bg-white border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-indigo-100 text-indigo-600 mt-1">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {course.title}
                        </h3>
                        {course.provider && (
                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {course.provider}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 ml-9 flex items-center text-xs text-indigo-600 font-medium">
                      Learn more
                      <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-700">
              <TextWithLinks text={courseRecommendations.content.replace(/\*\*/g, '').replace(/###/g, '')} />
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* Action Plan Section - New */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 border-0 shadow-md bg-gradient-to-b from-white to-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-cyan-600" />
            <h2 className="text-xl font-semibold">Next Steps</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100">
              <div className="p-1.5 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Update Your Resume</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Highlight your relevant experience and skills for this position.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100">
              <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Complete a Recommended Course</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Focus on the skill gaps mentioned to strengthen your profile.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-gray-100">
              <div className="p-1.5 rounded-full bg-purple-100 text-purple-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Prepare for Interview Questions</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Research common questions related to the identified skill areas.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}