"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Building2, Share2, BookmarkPlus, CheckCircle2, Globe2, Users, GraduationCap, BriefcaseIcon, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



// // app/dashboard/jobs/[id]/page.tsx

import { GetStaticPropsContext } from 'next';
import JobDetailsPage from '@/components/job-details-page';

export async function generateStaticParams() {
  // Fetch job IDs from your data source
  const jobIds = [1, 2, 3]; // Example job IDs

  return jobIds.map(id => ({
    id: id.toString(),
  }));
}

export default function JobPage({ params }: GetStaticPropsContext) {
  const { id } = params || {};

  return <JobDetailsPage jobId={id as string} />;
}