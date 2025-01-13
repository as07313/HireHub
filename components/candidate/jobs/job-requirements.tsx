"use client"

import { CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface JobRequirementsProps {
  requirements: readonly string[]
}

export function JobRequirements({ requirements }: JobRequirementsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Requirements</h2>
        <div className="grid gap-4">
          {requirements.map((requirement, index) => (
            <Card key={index} className="p-4 bg-primary/5 border-none">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{requirement}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}