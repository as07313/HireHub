"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

// Schemas
const securitySchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RecruiterSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState({
    security: false,
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Security Form
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
  } = useForm({ resolver: zodResolver(securitySchema) });

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
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsSubmitting(prev => ({ ...prev, security: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 max-w-3xl">
      <div className="flex flex-col space-y-1 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security.
        </p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="flex border-b w-full p-0 bg-transparent rounded-none">
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 px-4 py-2.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none text-muted-foreground hover:text-primary transition-all duration-150"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          {/* Add other TabsTrigger here if needed in the future */}
        </TabsList>

        <TabsContent value="security">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Password Settings</CardTitle>
              <CardDescription>
                Update your password regularly to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSecuritySubmit(onSecuritySubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-1.5 relative">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showPasswords.current ? "text" : "password"} 
                        {...registerSecurity("currentPassword")} 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {securityErrors.currentPassword && (
                      <p className="text-destructive text-xs pt-1">
                        {typeof securityErrors.currentPassword.message === "string" && securityErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 relative">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showPasswords.new ? "text" : "password"} 
                        {...registerSecurity("newPassword")} 
                        className="pr-10"
                      />
                       <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {securityErrors.newPassword && (
                      <p className="text-destructive text-xs pt-1">
                        {typeof securityErrors.newPassword.message === "string" && securityErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 relative">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showPasswords.confirm ? "text" : "password"} 
                        {...registerSecurity("confirmPassword")} 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {securityErrors.confirmPassword && (
                      <p className="text-destructive text-xs pt-1">
                        {typeof securityErrors.confirmPassword.message === "string" && securityErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting.security} className="w-full sm:w-auto">
                  {isSubmitting.security ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Change Password"
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