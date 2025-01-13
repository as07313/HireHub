"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface JobDescriptionProps {
  description: string
  responsibilities: readonly string[]
  skills: readonly string[]
}


export function JobDescription({ description, responsibilities, skills }: JobDescriptionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">About the Role</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Key Responsibilities</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {responsibilities.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}