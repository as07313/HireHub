// app/candidate/dashboard/layout.tsx
"use client"

import { useRouter, usePathname } from "next/navigation"
import { Briefcase, Heart, Bell, Settings, LogOut, Search, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: "Overview", 
    href: "/candidate/dashboard" 
  },
  { 
    icon: Search, 
    label: "Find Jobs", 
    href: "/candidate/dashboard/find-jobs" 
  },
  { 
    icon: Briefcase, 
    label: "Applied Jobs", 
    href: "/candidate/dashboard/applied" 
  },
  { 
    icon: Heart, 
    label: "Saved Jobs", 
    href: "/candidate/dashboard/saved" 
  },
  { 
    icon: Bell, 
    label: "Job Alerts", 
    href: "/candidate/dashboard/alerts" 
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/candidate/dashboard/settings" 
  }
]

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