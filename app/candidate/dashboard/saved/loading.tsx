// app/candidate/dashboard/saved/loading.tsx 
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

// Change to default export
export default function SavedJobsLoading() {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[450px]" />
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-3 w-[200px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}