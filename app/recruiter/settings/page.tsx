"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserCog, ShieldCheck, Bell } from "lucide-react";

// Schemas
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  applicationUpdates: z.boolean().default(true),
  newCandidates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState({
    profile: false,
    security: false,
    notifications: false
  });

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({ 
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      jobTitle: "",
      company: "",
      phone: ""
    }
  });

  // Security Form
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
  } = useForm({ resolver: zodResolver(securitySchema) });

  // Notifications Form
  const {
    register: registerNotifications,
    handleSubmit: handleNotificationsSubmit,
    formState: { errors: notificationsErrors },
    reset: resetNotifications
  } = useForm({ 
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      applicationUpdates: true,
      newCandidates: true,
      marketingEmails: false,
    }
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/recruiter/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Failed to fetch user data");
        
        const userData = await res.json();
        
        // Populate forms with user data
        resetProfile({
          fullName: userData.fullName || "",
          email: userData.email || "",
          jobTitle: userData.jobTitle || "",
          company: userData.company || "",
          phone: userData.phone || ""
        });
        
        resetNotifications({
          emailNotifications: userData.notifications?.emailNotifications ?? true,
          smsNotifications: userData.notifications?.smsNotifications ?? false,
          applicationUpdates: userData.notifications?.applicationUpdates ?? true,
          newCandidates: userData.notifications?.newCandidates ?? true,
          marketingEmails: userData.notifications?.marketingEmails ?? false,
        });
      } catch (error) {
        toast.error("Failed to load user settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [resetProfile, resetNotifications]);

  const onProfileSubmit = async (data: any) => {
    setIsSubmitting(prev => ({ ...prev, profile: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/recruiter/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(prev => ({ ...prev, profile: false }));
    }
  };

  const onSecuritySubmit = async (data: any) => {
    setIsSubmitting(prev => ({ ...prev, security: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/recruiter/settings/security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update password");
      }
      toast.success("Password updated successfully");
      resetSecurity();
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsSubmitting(prev => ({ ...prev, security: false }));
    }
  };

  const onNotificationsSubmit = async (data: any) => {
    setIsSubmitting(prev => ({ ...prev, notifications: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/recruiter/settings/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update notification settings");
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update notification preferences");
    } finally {
      setIsSubmitting(prev => ({ ...prev, notifications: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" type="text" {...registerProfile("fullName")} />
                    {profileErrors.fullName && (
                      <p className="text-destructive text-sm">
                        {typeof profileErrors.fullName.message === "string" && profileErrors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...registerProfile("email")} />
                    {profileErrors.email && (
                      <p className="text-destructive text-sm">
                        {typeof profileErrors.email.message === "string" && profileErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" type="text" {...registerProfile("jobTitle")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" type="text" {...registerProfile("company")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" {...registerProfile("phone")} />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting.profile}>
                  {isSubmitting.profile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSecuritySubmit(onSecuritySubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" {...registerSecurity("currentPassword")} />
                    {securityErrors.currentPassword && (
                      <p className="text-destructive text-sm">
                        {typeof securityErrors.currentPassword.message === "string" && securityErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" {...registerSecurity("newPassword")} />
                    {securityErrors.newPassword && (
                      <p className="text-destructive text-sm">
                        {typeof securityErrors.newPassword.message === "string" && securityErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" {...registerSecurity("confirmPassword")} />
                    {securityErrors.confirmPassword && (
                      <p className="text-destructive text-sm">
                        {typeof securityErrors.confirmPassword.message === "string" && securityErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting.security}>
                  {isSubmitting.security ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive from the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleNotificationsSubmit(onNotificationsSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      {...registerNotifications("emailNotifications")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      {...registerNotifications("smsNotifications")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="applicationUpdates">Application Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about candidate application status changes
                      </p>
                    </div>
                    <Switch
                      id="applicationUpdates"
                      {...registerNotifications("applicationUpdates")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newCandidates">New Candidate Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new candidates apply to your jobs
                      </p>
                    </div>
                    <Switch
                      id="newCandidates"
                      {...registerNotifications("newCandidates")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and updates
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      {...registerNotifications("marketingEmails")}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting.notifications}>
                  {isSubmitting.notifications ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}