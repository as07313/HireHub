"use client"

import { useRouter } from "next/navigation"
import { Briefcase, Heart, Bell, Settings, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Search, label: "Find Jobs", href: "/candidate/dashboard/find-jobs" },
  { icon: Briefcase, label: "Applied Jobs", href: "/candidate/dashboard/applied" },
  { icon: Heart, label: "Saved Jobs", href: "/candidate/dashboard/saved" },
  { icon: Bell, label: "Job Alerts", href: "/candidate/dashboard/alerts" },
  { icon: Settings, label: "Settings", href: "/candidate/dashboard/settings" },
]


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white shadow-sm">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-semibold text-primary">HireHub</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:bg-secondary hover:text-primary",
                      "transition-colors duration-200"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:bg-secondary hover:text-primary"
                onClick={() => router.push("/auth/login")}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}