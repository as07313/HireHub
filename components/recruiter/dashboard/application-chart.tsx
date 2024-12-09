"use client"

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Selected',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      label: 'Rejected',
      data: [28, 48, 40, 19, 86, 27],
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    },
  ],
}

export function ApplicationChart() {
  return <Bar options={options} data={data} height={300} />
}