"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCircle } from "lucide-react"

export default function RoleSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            How are you planning to use HireHub?
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="p-8 h-auto hover:bg-secondary/50"
            onClick={() => router.push("/recruiter/auth/register")}
          >
            <Card className="w-full p-6 hover:shadow-lg transition-shadow cursor-pointer group border-0 bg-transparent">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Recruiter</h2>
                <p className="text-muted-foreground">
                  I want to post jobs and find talented candidates
                </p>
              </div>
            </Card>
          </Button>

          <Button
            variant="ghost"
            className="p-8 h-auto hover:bg-secondary/50"
            onClick={() => router.push("/candidate/auth/register")}
          >
            <Card className="w-full p-6 hover:shadow-lg transition-shadow cursor-pointer group border-0 bg-transparent">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <UserCircle className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Candidate</h2>
                <p className="text-muted-foreground">
                  I want to find and apply for jobs
                </p>
              </div>
            </Card>
          </Button>
        </div>
      </div>
    </div>
  )
}