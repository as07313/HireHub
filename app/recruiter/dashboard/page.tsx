// app/recruiter/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { 
  TrendingUp,
  TrendingDown 
} from "lucide-react"
import {
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  UserCog as UserCogIcon,
  UserPlus as UserPlusIcon
} from 'lucide-react';
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartDataPoint {
  count: number;
  month: number;
  year: number;
}

interface ApplicationStage {
  _id: string;
  count: number;
  status: string;
}

interface ChartData {
  monthlyApplications: ChartDataPoint[];
  applicationsByStage: ApplicationStage[];
}

interface DashboardStat {
  label: string
  value: string
  trend: string
  icon: React.ElementType
}

// Chart options and data moved inline
const applicationChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true }
  }
}

const demographicsChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}

export default function RecruiterDashboardPage() {

  interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    status: 'active' | 'inactive';
    applicants: number;
    postedDate: Date;
    salary: {
      min: string;
      max: string;
    };
    experience: string;
    description: string;
    requirements: string;
    benefits: string;
  }




  const [jobs, setJobs] = useState<Job[]>([]);
    const [stats, setStats] = useState<DashboardStat[]>([
    { 
      label: 'Total Candidates', 
      value: '0', 
      trend: '0%',
      icon: UsersIcon 
    },
    { 
      label: 'Shortlisted', 
      value: '0',  
      trend: '0%',
      icon: UserCheckIcon 
    },
    { 
      label: 'Interviews', 
      value: '0', 
      trend: '0%',
      icon: UserCogIcon 
    },
    { 
      label: 'Hired', 
      value: '0', 
      trend: '0%',
      icon: UserPlusIcon 
    }
  ]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<ChartData>({
    monthlyApplications: [],
    applicationsByStage: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [jobsResponse, statsResponse, chartsResponse] = await Promise.all([
          fetch('/api/jobs/recruiter', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/dashboard/chart', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!jobsResponse.ok || !statsResponse.ok || !chartsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [jobsData, statsData, chartsData] = await Promise.all([
          jobsResponse.json(),
          statsResponse.json(),
          chartsResponse.json()
        ]);

        setJobs(jobsData);
        setStats(statsData.stats);
        setChartData(chartsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format data for charts
  const applicationChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: chartData.monthlyApplications.map(item => item.count),
        backgroundColor: 'rgb(99, 102, 241)',
        barThickness: 20,
        borderRadius: 4
      }
    ]
  };

  const stageChartData = {
    labels: ['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected'],
    datasets: [{
      data: chartData.applicationsByStage.map(stage => stage.count),
      backgroundColor: [
        'rgb(59, 130, 246)', // blue
        'rgb(147, 51, 234)', // purple
        'rgb(234, 179, 8)',  // yellow
        'rgb(34, 197, 94)',  // green
        'rgb(239, 68, 68)'   // red
      ]
    }]
  };
  // Rest of your component remains the same

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your recruitment metrics and activities</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                {/* Directly render the icon component */}
                {stat.icon && <stat.icon className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>


      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Applications</h2>
          <Bar
            data={applicationChartData}
            options={applicationChartOptions}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Applications by Stage</h2>
          <Doughnut
            data={stageChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.department} • {job.location}
                </p>
              </div>
              <div className="text-right">
                {/* <p className="text-sm font-medium">{job.applicants} Applicants</p> */}
                <p className="text-sm text-muted-foreground">
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}