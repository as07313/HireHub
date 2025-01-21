// app/candidate/dashboard/saved/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobList } from '@/components/candidate/dashboard/job-list';
import { useSavedJobs } from '@/hooks/use-saved-jobs';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedJobsPage() {
  const router = useRouter();
  const { savedJobs, loading, removeJob } = useSavedJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter jobs based on search and type
  console.log("savedJob",savedJobs)
  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || job.employmentType.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[450px]" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Saved Jobs</h1>
        <p className="text-muted-foreground">
          Keep track of jobs you're interested in and apply when you're ready
        </p>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No saved jobs found</p>
        </Card>
      ) : (
        <JobList 
          jobs={filteredJobs}
          type="saved"
          searchQuery={searchQuery}
          onViewDetails={(id) => router.push(`/candidate/dashboard/saved/${id}`)}
          onAction={removeJob}
          actionLabel="Remove"
          showStatus={false}
        />
      )}
    </div>
  );
}