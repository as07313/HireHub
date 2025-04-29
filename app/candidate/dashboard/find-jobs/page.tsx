"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Briefcase, Filter, Tags, X, ArrowRight, Code, PenTool, BarChart2, DollarSign, Heart } from "lucide-react" // Added more icons
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Removed JobList import as we'll implement the card layout here
import { Skeleton } from "@/components/ui/skeleton"
import { findJobs } from "@/app/actions/find-jobs"
import { BaseJob } from "@/app/types/job"
import { motion } from "framer-motion"

// Define filter options
const jobCategories = [
  { value: "", label: "All Categories", icon: <Tags className="h-4 w-4" /> },
  { value: "technology", label: "Technology", icon: <Code className="h-4 w-4" /> },
  { value: "design", label: "Design", icon: <PenTool className="h-4 w-4" /> },
  { value: "marketing", label: "Marketing", icon: <BarChart2 className="h-4 w-4" /> },
  { value: "finance", label: "Finance", icon: <DollarSign className="h-4 w-4" /> },
  { value: "healthcare", label: "Healthcare", icon: <Heart className="h-4 w-4" /> },
]

const jobTypes = [
  { value: "", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
]

const experienceLevels = [
  { value: "", label: "Any Experience" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
]

export default function FindJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<BaseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [jobType, setJobType] = useState("") // Added jobType state
  const [experience, setExperience] = useState("") // Added experience state
  const [activeFilters, setActiveFilters] = useState<{[key: string]: string}>({}) // Track active filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false) // Toggle advanced filters

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await findJobs()
        setJobs(fetchedJobs)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Update active filters when filter values change
  useEffect(() => {
    const newActiveFilters: {[key: string]: string} = {}
    if (category && jobCategories.find(c => c.value === category)) newActiveFilters.category = jobCategories.find(c => c.value === category)!.label
    if (jobType && jobTypes.find(t => t.value === jobType)) newActiveFilters.jobType = jobTypes.find(t => t.value === jobType)!.label
    if (experience && experienceLevels.find(e => e.value === experience)) newActiveFilters.experience = experienceLevels.find(e => e.value === experience)!.label
    if (location) newActiveFilters.location = location

    setActiveFilters(newActiveFilters)
  }, [category, jobType, experience, location])

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case 'category': setCategory(""); break;
      case 'jobType': setJobType(""); break;
      case 'experience': setExperience(""); break;
      case 'location': setLocation(""); break;
    }
  }

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills && Array.isArray(job.skills) && job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLocation = !location ||
      job.location.toLowerCase().includes(location.toLowerCase()) ||
      (job.workplaceType?.toLowerCase() === 'remote' && 'remote'.includes(location.toLowerCase()));

    const matchesCategory = !category ||
      job.department?.toLowerCase().includes(category.toLowerCase()); // Simple category match for now

    const matchesJobType = !jobType ||
      job.employmentType?.toLowerCase() === jobType.toLowerCase();

    const matchesExperience = !experience ||
      job.experience?.toLowerCase() === experience.toLowerCase();

    return matchesSearch && matchesLocation && matchesCategory && matchesJobType && matchesExperience;
  });

  // Transform jobs data for display
  const transformedJobs = filteredJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png', // Placeholder logo
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    workplaceType: job.workplaceType || 'On-site', // Default if missing
    postedDate: new Date(job.postedDate).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      // year: 'numeric' // Removed year for brevity
    })
  }));

  if (loading) {
    return (
      <div className="container max-w-6xl py-8 space-y-8">
        <div className="space-y-2"> {/* Reduced spacing */}
          <Skeleton className="h-8 w-[250px]" /> {/* Reduced height */}
          <Skeleton className="h-4 w-[350px]" /> {/* Reduced height */}
        </div>

        {/* Improved skeleton UI for search */}
        <Card className="p-6 border border-gray-200 shadow-sm bg-white rounded-lg"> {/* Simplified card */}
          <div className="space-y-4"> {/* Reduced spacing */}
            <div className="flex flex-col md:flex-row gap-3 items-center"> {/* Reduced gap */}
              <Skeleton className="h-10 w-full md:w-2/3" /> {/* Reduced height */}
              <Skeleton className="h-10 w-full md:w-1/3" /> {/* Reduced height */}
              {/* <Skeleton className="h-10 w-24" /> Removed search button skeleton */}
            </div>
             <Skeleton className="h-5 w-32" /> {/* Skeleton for filter toggle */}
            {/* Removed advanced filter skeletons for brevity */}
          </div>
        </Card>

        {/* Skeleton for job listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-4 border border-gray-200 shadow-sm rounded-lg"> {/* Simplified card */}
              <div className="flex gap-3 items-start"> {/* Reduced gap */}
                <Skeleton className="h-12 w-12 rounded-lg" /> {/* Reduced size */}
                <div className="space-y-1.5 flex-1"> {/* Reduced spacing */}
                  <Skeleton className="h-5 w-3/4" /> {/* Reduced height */}
                  <Skeleton className="h-4 w-1/2" /> {/* Reduced height */}
                  <div className="flex gap-1.5 mt-1.5"> {/* Reduced gap and margin */}
                    <Skeleton className="h-4 w-16 rounded-full" /> {/* Reduced size */}
                    <Skeleton className="h-4 w-16 rounded-full" /> {/* Reduced size */}
                    <Skeleton className="h-4 w-16 rounded-full" /> {/* Reduced size */}
                  </div>
                </div>
                {/* <Skeleton className="h-8 w-24 rounded-md" /> Removed button skeleton */}
              </div>
               <Skeleton className="h-4 w-1/4 mt-3" /> {/* Skeleton for posted date */}
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    // Removed the outer fragment <>...</> as it might be causing parsing issues
    <div className="container max-w-6xl py-8"> {/* Reduced py-10 */}
      {/* Enhanced header section */}
      <motion.div
        className="mb-6" // Reduced mb-10
        initial={{ opacity: 0, y: 15 }} // Reduced y
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} // Reduced duration
      >
        <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">Find Your Next Job</h1> {/* Reduced size & mb */}
        <p className="text-base text-gray-600 max-w-xl"> {/* Reduced size & max-w */}
          Search through available opportunities matching your profile.
        </p>
        {/* Removed job count badges for cleaner look */}
      </motion.div>

      {/* Modern search card UI */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} // Reduced y
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }} // Reduced delay
      >
        <Card className="mb-6 p-6 border border-gray-200 shadow-sm bg-white rounded-lg"> {/* Simplified card */}
          <div className="space-y-4"> {/* Reduced spacing */}
            {/* Main search bar */}
            <div className="flex flex-col md:flex-row gap-3"> {/* Reduced gap */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> {/* Adjusted icon color */}
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" // Adjusted size, border, focus
                />
              </div>
              <div className="relative md:w-1/3">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> {/* Adjusted icon color */}
                <Input
                  placeholder="Location or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9 h-10 text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" // Adjusted size, border, focus
                />
              </div>
              {/* Removed Search Button */}
            </div>

            {/* Toggle for advanced filters */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100"> {/* Lighter border */}
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-indigo-600 hover:text-indigo-800 pl-0 flex items-center gap-1.5 text-sm h-auto py-1 hover:bg-indigo-50" // Adjusted colors, size, gap
              >
                <Filter className="h-4 w-4" />
                {showAdvancedFilters ? 'Hide filters' : 'More filters'}
              </Button>

              {Object.keys(activeFilters).length > 0 && (
                <Button
                  variant="link"
                  className="text-gray-500 hover:text-red-600 text-xs px-1 h-auto py-0.5" // Smaller text, padding
                  onClick={() => {
                    setCategory("")
                    setJobType("")
                    setExperience("")
                    setLocation("")
                    // Keep searchQuery if desired, or clear it too: setSearchQuery("")
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Advanced filters */}
            {showAdvancedFilters && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100" // Reduced gap, pt
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }} // Faster transition
                
                            >
                              <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="h-10 border-gray-300 rounded-md shadow-sm text-sm"> {/* Adjusted size, border */}
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <Briefcase className="h-4 w-4 text-indigo-500" /> {/* Adjusted color */}
                                    <SelectValue placeholder="Category" /> {/* Simplified placeholder */}
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {jobCategories
                                    .filter(cat => cat.value !== "") // Filter out the item with empty value
                                    .map(cat => (
                                    <SelectItem key={cat.value} value={cat.value} className="text-sm"> {/* Added text-sm */}
                                      <div className="flex items-center gap-2">
                                        {cat.icon}
                                        <span>{cat.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
              
                              <Select value={jobType} onValueChange={setJobType}>
                                <SelectTrigger className="h-10 border-gray-300 rounded-md shadow-sm text-sm"> {/* Adjusted size, border */}
                                   <div className="flex items-center gap-2 text-gray-500">
                                     <Tags className="h-4 w-4 text-indigo-500" /> {/* Adjusted color */}
                                     <SelectValue placeholder="Job Type" />
                                   </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {jobTypes
                                    .filter(type => type.value !== "") // Filter out the item with empty value
                                    .map(type => (
                                    <SelectItem key={type.value} value={type.value} className="text-sm">
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
              
                              <Select value={experience} onValueChange={setExperience}>
                                <SelectTrigger className="h-10 border-gray-300 rounded-md shadow-sm text-sm"> {/* Adjusted size, border */}
                                   <div className="flex items-center gap-2 text-gray-500">
                                     <Briefcase className="h-4 w-4 text-indigo-500" /> {/* Adjusted color */}
                                     <SelectValue placeholder="Experience" /> {/* Simplified placeholder */}
                                   </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {experienceLevels
                                    .filter(level => level.value !== "") // Filter out the item with empty value
                                    .map(level => (
                                    <SelectItem key={level.value} value={level.value} className="text-sm">
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </motion.div>
                          )}

            {/* Active filters display */}
            {Object.keys(activeFilters).length > 0 && !showAdvancedFilters && ( // Show only when advanced filters are hidden
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100"> {/* Reduced gap, pt */}
                {/* <span className="text-xs font-medium text-gray-500 mr-1.5">Active:</span> Removed label */}
                {Object.entries(activeFilters).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors rounded text-xs font-medium" // Adjusted style, size
                  >
                    {value}
                    <button
                      onClick={() => handleRemoveFilter(key)}
                      className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none" // Adjusted spacing, color
                      aria-label={`Remove ${value} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Job listings with enhanced styling */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} // Reduced y
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }} // Reduced delay
      >
        {transformedJobs.length === 0 ? (
          <Card className="p-8 text-center border border-gray-200 rounded-lg bg-white"> {/* Simplified card */}
            <div className="flex flex-col items-center justify-center space-y-3"> {/* Reduced spacing */}
              <div className="bg-indigo-50 p-3 rounded-full"> {/* Adjusted padding */}
                <Search className="h-6 w-6 text-indigo-500" /> {/* Adjusted size */}
              </div>
              <h3 className="text-lg font-medium text-gray-800">No jobs found</h3> {/* Adjusted size, color */}
              <p className="text-sm text-gray-500 max-w-sm"> {/* Adjusted size, max-w */}
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {transformedJobs.map((job) => (
              <Card
                key={job.id}
                className="p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 rounded-lg bg-white cursor-pointer group" // Adjusted padding, hover effect
                onClick={() => router.push(`/candidate/dashboard/find-jobs/${job.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3"> {/* Reduced gap */}
                    {/* Placeholder Logo */}
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-indigo-50 border border-indigo-100 shrink-0"> {/* Adjusted size, colors */}
                      <Briefcase className="h-5 w-5 text-indigo-500" /> {/* Adjusted size */}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900 group-hover:text-indigo-700 transition-colors">{job.title}</h3> {/* Adjusted size */}
                      <p className="text-gray-600 text-sm">{job.company}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2"> {/* Reduced gap, margin */}
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 rounded-full px-2 py-0.5 text-xs font-medium"> {/* Adjusted style */}
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"> {/* Adjusted style */}
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                         <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 rounded-full px-2 py-0.5 text-xs font-medium"> {/* Adjusted style */}
                          {job.workplaceType}
                        </Badge>
                        {/* Salary Badge removed from main card view for cleaner look */}
                      </div>
                    </div>
                  </div>
                  {/* Arrow Icon */}
                   <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors mt-1 shrink-0" /> {/* Adjusted size */}
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100"> {/* Reduced margin, lighter border */}
                  <div className="text-xs text-gray-500"> {/* Smaller text */}
                    Posted {job.postedDate}
                  </div>
                   <span className="text-sm font-semibold text-green-600"> {/* Adjusted size */}
                     {job.salary}
                   </span>
                  {/* Apply button removed from card view */}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Optional: Add pagination if needed */}
        {/* {transformedJobs.length > 0 && (
          <div className="mt-6 flex justify-center"> // Reduced margin
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-9 px-3"> // Adjusted style, size
              Load more jobs
            </Button>
          </div>
        )} */}
      </motion.div>
    </div>
  )
}