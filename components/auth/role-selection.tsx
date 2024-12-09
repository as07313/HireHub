"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Users, UserCircle } from "lucide-react"

export function RoleSelection() {
  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
      <Link href="/auth/recruiter/register" className="block">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
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
      </Link>

      <Link href="/auth/candidate/register" className="block">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
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
      </Link>
    </div>
  )
}