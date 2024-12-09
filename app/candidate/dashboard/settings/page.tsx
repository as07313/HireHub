"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/settings/profile-form"
import { SecurityForm } from "@/components/settings/security-form"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { ResumeManager } from "@/components/settings/resume-manager"

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="w-full justify-start border-b bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="resume"
            className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <ProfileForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-8">
          <SecurityForm />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-8">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="resume" className="space-y-8">
          <ResumeManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}