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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Job Fit Score</h2>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
            <div>
              <p className="text-3xl font-bold">{applicant.jobFitScore}%</p>
              <p className="text-sm text-muted-foreground">Match Score</p>
            </div>
          </div>
          <Progress value={applicant.jobFitScore} className="h-2" />
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <Card className="p-6">
          <p className="text-muted-foreground leading-relaxed">{applicant.bio}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill: string) => (
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
              <p className="font-medium">{applicant.education.degree}</p>
              <p className="text-sm text-muted-foreground">
                {applicant.education.school} • {applicant.education.year}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
        <Card className="p-6">
          <div className="space-y-6">
            {applicant.workHistory.map((work: any, index: number) => (
              <div key={index}>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">{work.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {work.company} • {work.duration}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {work.description}
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