"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"


interface JobBenefitsProps {

  benefits: readonly string[]

}


export function JobBenefits({ benefits }: JobBenefitsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}