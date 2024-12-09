"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface JobInsightsProps {
  jobId: string
}

const applicationData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Applications',
      data: [45, 59, 32, 20],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Applications Over Time',
    },
  },
}

const qualificationStats = [
  { label: "Experience Match", value: 85 },
  { label: "Skills Match", value: 92 },
  { label: "Education Match", value: 78 },
  { label: "Location Match", value: 95 },
]

export function JobInsights({ jobId }: JobInsightsProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Application Trends</h3>
          <Bar options={options} data={applicationData} height={300} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Candidate Qualification</h3>
          <div className="space-y-6">
            {qualificationStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.value}%
                  </span>
                </div>
                <Progress value={stat.value} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-blue-700">
              <strong>High Match Rate:</strong> 85% of applicants meet the minimum requirements
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-green-700">
              <strong>Strong Response:</strong> Application rate is 25% above average
            </p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-yellow-700">
              <strong>Suggestion:</strong> Consider adjusting experience requirements to attract more candidates
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}