// components/job-details-page.tsx

"use client"

import React from 'react';
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Building2, Share2, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

interface JobDetailsPageProps {
  jobId: string;
}

const jobDetails = {
  id: 1,
  title: "Senior UX Designer",
  company: "Microsoft",
  location: "Washington",
  salary: "$50k-80k/month",
  type: "Full Time",
  experience: "5+ years",
  department: "Design",
  postedDate: "2 weeks ago",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  description: `We are looking for a talented UX Designer to create amazing user experiences. The ideal candidate should have a keen eye for clean and artful design, possess superior UI knowledge, and be able to translate high-level requirements into interaction flows and artifacts.`,
  requirements: [
    "5+ years of UX design experience",
    "Strong portfolio of design projects",
    "Excellent problem-solving skills",
    "Experience with design tools (Figma, Sketch)",
    "Knowledge of HTML/CSS/JavaScript",
    "Bachelor's degree in Design or related field"
  ],
  responsibilities: [
    "Create user-centered designs by understanding business requirements",
    "Develop and conceptualize a comprehensive UI/UX design strategy",
    "Produce high-quality UX design solutions through wireframes",
    "Create original graphic designs",
    "Prepare and present rough drafts to internal teams",
    "Identify and troubleshoot UX problems",
    "Conduct layout adjustments based on user feedback"
  ],
  benefits: [
    "Competitive salary package",
    "Health, dental, and vision insurance",
    "401(k) matching",
    "Flexible working hours",
    "Remote work options",
    "Professional development",
    "Gym membership",
    "Annual bonus"
  ],
  skills: [
    "UI/UX Design",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Figma",
    "Adobe XD",
    "Design Systems"
  ]
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId }) => {
  // Fetch job details using the jobId if needed
  // const jobDetails = fetchJobDetails(jobId);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Back Button */}
      <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-xl border bg-white p-2">
                <Image
                  src={jobDetails.logo}
                  alt={jobDetails.company}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{jobDetails.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {jobDetails.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {jobDetails.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {jobDetails.postedDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {jobDetails.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {jobDetails.experience}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {jobDetails.department}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p className="whitespace-pre-line">{jobDetails.description}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Benefits</h2>
            <div className="space-y-3">
              {jobDetails.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;