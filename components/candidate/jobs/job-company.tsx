"use client"

import { Card } from "@/components/ui/card"
import { Users, Globe2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface JobCompanyProps {
  description: string
  teamSize: string
  workplaceType: string
}

export function JobCompany({ description, teamSize, workplaceType }: JobCompanyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">About the Company</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <Separator />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-4 bg-primary/5 border-none">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Team Size</p>
              <p className="text-sm text-muted-foreground">{teamSize}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5 border-none">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Work Type</p>
              <p className="text-sm text-muted-foreground">{workplaceType}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}