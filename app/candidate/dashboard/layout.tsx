// app/candidate/dashboard/layout.tsx
import { DashboardNav } from "./dashboard-nav"
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Responsive sidebar that collapses on mobile */}
      <div className="fixed inset-y-0 z-30 md:relative md:z-auto">
        <DashboardNav />
      </div>
      
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}