"use client"

import { Card } from "@/components/ui/card"
import { Users, UserCheck, UserCog, UserPlus } from "lucide-react"

const stats = [
  {
    title: "Total Applicants",
    value: "10,000",
    subtitle: "In Review",
    icon: Users,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Selected Candidates",
    value: "800",
    subtitle: "Selected List",
    icon: UserCheck,
    trend: "+5%",
    trendUp: true,
  },
  {
    title: "Interview Stage",
    value: "100",
    subtitle: "Accepted",
    icon: UserCog,
    trend: "-2%",
    trendUp: false,
  },
  {
    title: "Final Stage",
    value: "100",
    subtitle: "Offering Stage",
    icon: UserPlus,
    trend: "+8%",
    trendUp: true,
  },
]

export function RecruiterStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  <span className={`ml-2 text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}