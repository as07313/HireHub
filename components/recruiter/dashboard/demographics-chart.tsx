"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Male', 'Female', 'Other'],
  datasets: [
    {
      data: [90, 65, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)',
        'rgba(168, 85, 247, 0.5)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export function DemographicsChart() {
  return (
    <div className="flex justify-center">
      <div className="w-[300px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}