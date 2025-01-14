"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation" 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {JobList} from '@/components/candidate/dashboard/job-list';
import {jobs} from '@/lib/data/jobs';

export default function FindJobsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Jobs</h1>
        <p className="text-muted-foreground">Discover your next opportunity</p>
      </div>

      <Card className="mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Job title, keyword, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </Card>

      <JobList 
        jobs={[...jobs]}
        type="all"
        searchQuery={searchQuery}
        onViewDetails={(id) => router.push(`/candidate/dashboard/find-jobs/${id}`)}
        // onAction={(id) => handleApplyToJob(id)}
        actionLabel="Apply"
        showStatus={false}
      />
    </div>
  )
}