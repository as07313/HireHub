'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, GraduationCap, Briefcase } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ApplicantProfileProps {
  applicant: any;
}

export function ApplicantProfile({ applicant }: ApplicantProfileProps) {
  console.log("applicant parsed data", applicant.resume.parsedData)
  
  return (
    <div className="space-y-6">
      

      <div>
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <Card className="p-6">
          <p className="text-muted-foreground leading-relaxed">{applicant.resume.parsedData.Summary}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            {applicant.resume.parsedData.Skills.map((skill: string) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">{applicant.resume.parsedData.Education[0].Degree}</p>
              <p className="text-sm text-muted-foreground">
                {applicant.resume.parsedData.Education[0].Institution} • {applicant.resume.parsedData.Education[0].Year}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
        <Card className="p-6">
          <div className="space-y-6">
            {applicant.resume.parsedData["Work Experience"].map((work: any, index: number) => (
              <div key={index}>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">{work['Job Title']}</p>
                    <p className="text-sm text-muted-foreground">
                      {work.Company} • {work.Duration}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {work.Description}
                    </p>
                  </div>
                </div>
                {index < applicant.workHistory.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}