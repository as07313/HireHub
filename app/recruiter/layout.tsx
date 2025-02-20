"use client"

import { useRouter, usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  LogOut, 
  PlusCircle,
  BriefcaseIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: "Overview", 
    href: "/recruiter/dashboard",
    description: "View analytics and insights"
  },
  { 
    icon: PlusCircle, 
    label: "Post a Job", 
    href: "/recruiter/jobs/new",
    description: "Create a new job listing"
  },
  { 
    icon: BriefcaseIcon, 
    label: "My Jobs", 
    href: "/recruiter/jobs",
    description: "Manage your job postings"
  },
  // { 
  //   icon: Users, 
  //   label: "Candidates", 
  //   href: "/recruiter/candidates",
  //   description: "View and manage applicants"
  // },
  { 
    icon: Building2, 
    label: "Company", 
    href: "/recruiter/company/setup",
    description: "Manage company profile"
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/recruiter/settings",
    description: "Account preferences and settings"
  },
  { 
    icon: FileText, 
    label: "Chat Assistant", 
    href: "/recruiter/chatassistant",
    description: "Privacy policy and terms of service"
  },
]

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/recruiter/logout', {
        method: 'POST'
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
  
      // Redirect to login page
      router.push('/recruiter/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  


  if (pathname?.startsWith("/recruiter/auth")) {
    return children
  }

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen border-r bg-white w-64">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary p-1">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-primary">HireHub</h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 text-left",
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/20" 
                        : "text-muted-foreground hover:bg-secondary hover:text-primary",
                      "transition-colors duration-200"
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Button>
                )
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="border-t p-4">
              <div className="mb-4 flex items-center gap-3 px-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">HR Manager</p>
                </div>
              </div>
              <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}