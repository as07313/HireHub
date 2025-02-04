// app/candidate/dashboard/saved/page.tsx
import { Suspense } from "react"
import { getSavedJobs } from "@/app/actions/save-jobs"
import { SavedJobsClient } from "@/app/candidate/dashboard/saved/saved-jobs-client"
import SavedJobsLoading from "./loading" // Change to default import

export const dynamic = 'force-dynamic'

export default async function SavedJobsPage() {
  const savedJobs = await getSavedJobs()
  console.log(savedJobs)

  return (
    <Suspense fallback={<SavedJobsLoading />}>
      <SavedJobsClient initialJobs={savedJobs} />
    </Suspense>
  )
}

// const SavedJobsPage = () => {
//   return (
//       <div>
//           <h1>Saved Job</h1>
//       </div>
//   )
// }

// export default SavedJobsPage