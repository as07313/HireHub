"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCircle, Building2, Briefcase } from "lucide-react"
import { motion } from "framer-motion"

export default function RoleSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-primary p-4 rounded-2xl">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to HireHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose how you&apos;d like to use HireHub and start your journey
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="ghost"
              className="w-full p-8 h-auto hover:bg-secondary/50"
              onClick={() => router.push("/recruiter/auth/register")}
            >
              <Card className="w-full p-8 hover:shadow-lg transition-shadow cursor-pointer group border-0 bg-transparent">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">I&apos;m a Recruiter</h2>
                    <p className="text-muted-foreground">
                      Post jobs and find talented candidates for your organization
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center gap-2 text-sm bg-primary/5 text-primary px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4" />
                      <span>Post Jobs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-primary/5 text-primary px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" />
                      <span>Track Applications</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              variant="ghost"
              className="w-full p-8 h-auto hover:bg-secondary/50"
              onClick={() => router.push("/candidate/auth/register")}
            >
              <Card className="w-full p-8 hover:shadow-lg transition-shadow cursor-pointer group border-0 bg-transparent">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <UserCircle className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">I&apos;m a Job Seeker</h2>
                    <p className="text-muted-foreground">
                      Find and apply for your dream job opportunities
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="flex items-center gap-2 text-sm bg-primary/5 text-primary px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4" />
                      <span>Search Jobs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-primary/5 text-primary px-3 py-1 rounded-full">
                      <UserCircle className="w-4 h-4" />
                      <span>Track Progress</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}