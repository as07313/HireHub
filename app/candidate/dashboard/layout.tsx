// app/candidate/dashboard/layout.tsx
import { DashboardNav } from "./dashboard-nav"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-white">
      <DashboardNav />
      <main className="ml-64 flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}