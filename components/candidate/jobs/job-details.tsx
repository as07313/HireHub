"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock,
  Share2,
  BookmarkPlus,
  BookmarkX,
  CheckCircle2,
  BriefcaseIcon,
  Banknote,
  GraduationCap,
  Globe2,
  Users
} from "lucide-react"
import { useSavedJobs } from "@/hooks/use-saved-jobs"
import { JobApplicationDialog } from "@/components/candidate/jobs/job-application-dialog"


interface JobDetailsProps {
  job: {
    id: string;
    recruiterId: string;
    title: string;
    department: string;
    location: string;
    workplaceType: 'onsite' | 'hybrid' | 'remote';
    employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
    status: 'active' | 'inactive' | 'closed';
    salary: {
      min: string;
      max: string;
    };
    experience: 'entry' | 'mid' | 'senior' | 'lead';
    description: string;
    requirements: string[];
    benefits: string[];
    skills: string[];
    postedDate: Date;
    logo: string;
    company: string;
    companyDescription?: string;
  };
  backLink: string;
  backLabel: string;
  showActions?: boolean;
  showApplyButton?: boolean;
}

export function JobDetails({ 
  job, 
  backLink, 
  backLabel,
  showActions = false,
  showApplyButton = false 
}: JobDetailsProps) {
  const { savedJobs, saveJob, removeJob } = useSavedJobs();
  const [isSaving, setIsSaving] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  if (!job) return <div>Job not found</div>;

  // Fix: Check if savedJobs is an array and handle the id comparison correctly
  const isSaved = Array.isArray(savedJobs?.savedJobs) && 
    savedJobs.savedJobs.some(savedJob => savedJob._id === job.id);

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await removeJob(job.id);
      } else {
        await saveJob(job.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(job.postedDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <>
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link 
        href={backLink} 
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-xl border bg-white p-2">
                {/* <Image
                  src={job.logo}
                  alt={job.company}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                /> */}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                  {showActions && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleToggleSave}
                        disabled={isSaving}
                      >
                        {isSaved ? (
                          <BookmarkX className="h-4 w-4 text-red-500" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {job.employmentType}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {job.workplaceType}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {job.experience}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Job Content Tabs */}
          <Card className="p-6">
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company">
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {job.companyDescription}
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Card className="p-4 bg-primary/5 border-none">
                      <div className="flex items-center gap-3">
                        <Globe2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Work Type</p>
                          <p className="text-sm text-muted-foreground">
                            {job.workplaceType}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                    <div className="grid gap-4">
                      {job.requirements.map((requirement, index) => (
                        <Card key={index} className="p-4 bg-primary/5 border-none">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed">{requirement}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Job Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{job.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">${job.salary.min}-${job.salary.max}</p>
                </div>
              </div>
            </div>
            {showApplyButton && (
              <Button 
                className="w-full mt-6"
                onClick={() => setShowApplicationDialog(true)}
              >
                Apply Now
              </Button>
            )}
          </Card>

          {/* Benefits */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
            <div className="space-y-3">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
        <JobApplicationDialog 
        open={showApplicationDialog}
        onOpenChange={setShowApplicationDialog}
      />
        </>
  );
}