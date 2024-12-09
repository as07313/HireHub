import { jobs } from "./jobs"

export const appliedJobs = [
  {
    ...jobs[0],
    appliedDate: "2024-01-15",
    status: "interviewing",
    nextInterview: "2024-02-01T15:00:00Z",
  },
  {
    ...jobs[1],
    appliedDate: "2024-01-10",
    status: "active",
  },
  {
    ...jobs[2],
    appliedDate: "2024-01-05",
    status: "offered",
  },
] as const

export type AppliedJob = (typeof appliedJobs)[number]
export type JobStatus = "active" | "interviewing" | "offered" | "rejected"