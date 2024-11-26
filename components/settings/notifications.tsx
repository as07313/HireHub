"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailAlerts: true,
    jobMatches: true,
    applicationUpdates: true,
    marketingEmails: false,
    profileViews: true,
    newMessages: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement notification settings update logic
      console.log(settings)
      toast.success("Notification settings updated")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Notification Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Choose what notifications you want to receive
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-alerts" className="flex flex-col space-y-1">
              <span>Email Alerts</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive alerts about your account activity
              </span>
            </Label>
            <Switch
              id="email-alerts"
              checked={settings.emailAlerts}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, emailAlerts: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="job-matches" className="flex flex-col space-y-1">
              <span>Job Matches</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified when new jobs match your preferences
              </span>
            </Label>
            <Switch
              id="job-matches"
              checked={settings.jobMatches}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, jobMatches: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label
              htmlFor="application-updates"
              className="flex flex-col space-y-1"
            >
              <span>Application Updates</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive updates about your job applications
              </span>
            </Label>
            <Switch
              id="application-updates"
              checked={settings.applicationUpdates}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, applicationUpdates: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive tips, trends, and industry insights
              </span>
            </Label>
            <Switch
              id="marketing-emails"
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, marketingEmails: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="profile-views" className="flex flex-col space-y-1">
              <span>Profile Views</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified when employers view your profile
              </span>
            </Label>
            <Switch
              id="profile-views"
              checked={settings.profileViews}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, profileViews: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="new-messages" className="flex flex-col space-y-1">
              <span>New Messages</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive notifications for new messages
              </span>
            </Label>
            <Switch
              id="new-messages"
              checked={settings.newMessages}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, newMessages: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </Card>
  )
}