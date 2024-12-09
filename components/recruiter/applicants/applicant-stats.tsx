"use client"

import { Card } from "@/components/ui/card"
import { Users, UserCheck, Clock, UserX } from "lucide-react"

const stats = [
  {
    title: "Total Applicants",
    value: "156",
    trend: "+12%",
    trendUp: true,
    icon: Users,
    color: "blue",
  },
  {
    title: "Shortlisted",
    value: "48",
    trend: "+5%",
    trendUp: true,
    icon: UserCheck,
    color: "green",
  },
  {
    title: "In Progress",
    value: "32",
    trend: "+8%",
    trendUp: true,
    icon: Clock,
    color: "yellow",
  },
  {
    title: "Rejected",
    value: "76",
    trend: "+2%",
    trendUp: false,
    icon: UserX,
    color: "red",
  },
]

export function ApplicantStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                <Icon className={`h-5 w-5 text-${stat.color}-500`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}