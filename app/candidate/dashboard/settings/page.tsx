// Removed "use client" directive

// Removed client-side imports: useState, zodResolver, useForm, motion
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/candidate/settings/profile-form"
import { SecurityForm } from "@/components/candidate/settings/security-form"
import { NotificationSettings } from "@/components/candidate/settings/notification-settings"
import { ResumeManager } from "@/components/candidate/settings/resume-manager"
import { UserCog, ShieldCheck, FileText, Bell } from "lucide-react" // Import icons

// Removed zod import

export default function SettingsPage() {
  // Removed useForm hook and related state/functions

  return (
    <div className="container max-w-6xl py-8">
      {/* Header - Removed motion.div */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-normal text-gray-900">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        {/* Modern Tabs List */}
        <TabsList className="grid grid-cols-4 w-full max-w-md bg-muted p-1 rounded-lg h-auto">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <UserCog className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="resume"
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all"
          >
            <FileText className="h-4 w-4" />
            Resume
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="profile">
          {/* ProfileForm remains a client component */}
          <ProfileForm />
        </TabsContent>

        <TabsContent value="security">
          {/* SecurityForm remains a client component */}
          <SecurityForm />
        </TabsContent>

        <TabsContent value="notifications">
          {/* NotificationSettings remains a client component */}
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="resume">
          {/* ResumeManager remains a client component */}
          <ResumeManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}