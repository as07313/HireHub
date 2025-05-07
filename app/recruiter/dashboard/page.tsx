"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
// ... (other imports remain the same)
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

import {
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  UserCog as UserCogIcon,
  UserPlus as UserPlusIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus as MinusIcon, // For neutral trend
  PlusCircle as PlusCircleIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Eye as EyeIcon,
  Edit3 as Edit3Icon,
  UsersRound,
  Briefcase
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
import { motion } from "framer-motion"

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

interface MonthlyApplicationData {
  _id: {
    year: number;
    month: number; // 1-12
  };
  count: number;
}

interface ApplicationStage {
  _id: string; // Status string e.g., "new", "screening"
  count: number;
}

interface ChartData {
  monthlyApplications: MonthlyApplicationData[];
  applicationsByStage: ApplicationStage[];
}

interface DashboardStat {
  label: string
  value: string
  trend: string
  icon: React.ElementType
  iconColor?: string // Optional: for specific icon colors
}

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  status: 'active' | 'inactive' | 'open' | 'closed';
  postedDate: Date | string;
  applicantStats?: {
    total: number;
  };
}

const applicationChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'hsl(var(--card))', // Use card background for tooltip
      titleColor: 'hsl(var(--card-foreground))',
      bodyColor: 'hsl(var(--card-foreground))',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: 'hsl(var(--muted-foreground))',
      },
      grid: {
        color: 'hsl(var(--border) / 0.5)', // Lighter grid lines
      }
    },
    x: {
      ticks: {
        color: 'hsl(var(--muted-foreground))',
      },
      grid: {
        display: false, // Keep x-axis grid lines hidden
      }
    }
  }
}

const stageChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'hsl(var(--muted-foreground))',
        boxWidth: 12,
        padding: 20,
      }
    },
    tooltip: {
      backgroundColor: 'hsl(var(--card))',
      titleColor: 'hsl(var(--card-foreground))',
      bodyColor: 'hsl(var(--card-foreground))',
      borderColor: 'hsl(var(--border))',
      borderWidth: 1,
    }
  },
  elements: {
    arc: {
      borderWidth: 0 // Remove border from doughnut segments
    }
  }
}

// Blue/Indigo themed color palette
const stageColorPalette = [
  'hsl(221, 83%, 53%)', // Primary Blue (e.g., shadcn blue-600)
  'hsl(240, 50%, 65%)', // Indigo
  'hsl(210, 70%, 75%)', // Lighter Blue
  'hsl(250, 60%, 70%)', // Lighter Indigo
  'hsl(200, 80%, 60%)', // Sky Blue
  'hsl(230, 40%, 50%)', // Muted Indigo
  'hsl(220, 30%, 40%)', // Darker Muted Blue
  'hsl(210, 20%, 85%)', // Very Light Blue/Gray for unknown
];

const statusToColorMap: Record<string, string> = {
  new: stageColorPalette[0],       // Primary Blue
  screening: stageColorPalette[1], // Indigo
  shortlist: stageColorPalette[2], // Lighter Blue
  interview: stageColorPalette[3], // Lighter Indigo
  hired: 'hsl(142, 71%, 45%)',   // Keep green for Hired for visual distinction
  rejected: 'hsl(0, 72%, 51%)',   // Keep red for Rejected for visual distinction
  offer: stageColorPalette[4],    // Sky Blue
  unknown: stageColorPalette[7]   // Very Light Blue/Gray
};


export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([
    { label: 'Total Candidates', value: '0', trend: '0%', icon: UsersIcon, iconColor: "text-blue-500" }, // Adjusted icon color
    { label: 'Screening', value: '0', trend: '0%', icon: UserCheckIcon, iconColor: "text-indigo-500" }, // Adjusted icon color
    { label: 'Interviews', value: '0', trend: '0%', icon: UserCogIcon, iconColor: "text-sky-500" }, // Adjusted icon color
    { label: 'Hired', value: '0', trend: '0%', icon: UserPlusIcon, iconColor: "text-green-500" }
  ]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    monthlyApplications: [],
    applicationsByStage: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          router.push('/recruiter/auth/login'); // Redirect to login
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        const [jobsResponse, statsResponse, chartsResponse] = await Promise.all([
          fetch('/api/jobs/recruiter', { headers }),
          fetch('/api/dashboard/stats', { headers }),
          fetch('/api/dashboard/chart', { headers })
        ]);

        if (!jobsResponse.ok) throw new Error(`Failed to fetch jobs: ${jobsResponse.statusText}`);
        if (!statsResponse.ok) throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
        if (!chartsResponse.ok) throw new Error(`Failed to fetch chart data: ${chartsResponse.statusText}`);

        const jobsData = await jobsResponse.json();
        const apiStatsData = await statsResponse.json();
        const chartsDataResponse = await chartsResponse.json();
        
        const iconMap: { [key: string]: React.ElementType } = {
          'Users': UsersIcon,
          'UserCheck': UserCheckIcon,
          'UserCog': UserCogIcon,
          'UserPlus': UserPlusIcon
        };

        // Updated color map for stats icons to match blue/indigo theme
        const colorMap: { [key: string]: string } = {
          'Users': "text-blue-500",
          'UserCheck': "text-indigo-500",
          'UserCog': "text-sky-500",
          'UserPlus': "text-green-500" // Hired can remain green
        };
        
        const transformedStats = apiStatsData.stats.map((stat: any) => ({
          ...stat,
          icon: iconMap[stat.icon] || UsersIcon, 
          iconColor: colorMap[stat.icon] || "text-gray-500"
        }));

        setJobs(jobsData);
        setStats(transformedStats);
        setChartData(chartsDataResponse);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

  const monthlyAppLabels = chartData.monthlyApplications.map(
    item => `${getMonthName(item._id.month)} ${item._id.year}`
  );
  const monthlyAppCounts = chartData.monthlyApplications.map(item => item.count);

  const applicationChartData = {
    labels: monthlyAppLabels,
    datasets: [
      {
        label: 'Total Applications',
        data: monthlyAppCounts,
        backgroundColor: 'hsl(221, 83%, 53%)', // Primary Blue from palette
        hoverBackgroundColor: 'hsl(221, 83%, 63%)', // Slightly lighter blue on hover
        borderColor: 'hsl(221, 83%, 53%)', // Border same as background for solid look
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4
      }
    ]
  };

  const stageLabels = chartData.applicationsByStage.map(stage => {
    const status = stage._id || "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  });
  const stageCounts = chartData.applicationsByStage.map(stage => stage.count);
  const stageBackgroundColors = chartData.applicationsByStage.map(
    (stage, index) => statusToColorMap[(stage._id || "unknown").toLowerCase()] || stageColorPalette[index % stageColorPalette.length]
  );

  const stageChartData = {
    labels: stageLabels,
    datasets: [{
      data: stageCounts,
      backgroundColor: stageBackgroundColors,
      // borderColor: 'hsl(var(--background))', // Removed segment borders for cleaner look
      // borderWidth: 0, // Ensure no border
      hoverOffset: 4, // Reduced hover offset
      // hoverBorderColor: 'hsl(var(--foreground))', // Can be removed if no border desired
    }]
  };

  const TrendIcon = ({ trendValue }: { trendValue: string }) => {
    if (trendValue.startsWith('+')) return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
    if (trendValue.startsWith('-')) return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-gray-500" />;
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2"> {/* Adjusted from md:grid-cols-5 for skeleton */}
          <Card className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>

        {/* Recent Jobs Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto py-8 px-4 md:px-6 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Track your recruitment metrics and activities.</p>
        </div>
        <Button onClick={() => router.push('/recruiter/jobs/new')}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              {stat.icon && <stat.icon className={`h-5 w-5 ${stat.iconColor || 'text-muted-foreground'}`} />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3 p-6 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold">Monthly Applications</CardTitle>
            <CardDescription>Total applications received per month over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[300px] md:h-[350px]">
            {monthlyAppCounts.length > 0 ? (
              <Bar data={applicationChartData} options={applicationChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No application data for the selected period.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 p-6 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold">Applications by Stage</CardTitle>
            <CardDescription>Distribution of candidates across various application stages.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[300px] md:h-[350px]">
            {stageCounts.length > 0 ? (
              <Doughnut data={stageChartData} options={stageChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No application stage data available.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Jobs */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Job Postings</CardTitle>
                <CardDescription>Overview of your most recently posted jobs.</CardDescription>
              </div>
              <Link href="/recruiter/jobs" passHref>
                <Button variant="outline" size="sm">View All Jobs</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {jobs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Location</TableHead>
                    <TableHead className="text-center">Applicants</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */} {/* Actions column removed */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.slice(0, 5).map((job) => (
                    <TableRow key={job._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div 
                          className="font-medium text-foreground hover:text-primary cursor-pointer"
                          onClick={() => router.push(`/recruiter/jobs/${job._id}/applicants`)}
                        >
                          {job.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">{job.department}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{job.location}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{job.applicantStats?.total ?? 0}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">
                        <Badge 
                          variant={job.status === 'active' || job.status === 'open' ? 'default' : 'secondary'}
                          className={`${
                            job.status === 'active' || job.status === 'open' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' 
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300'
                          } capitalize`}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      {/* Action cell removed */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Briefcase className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                No recent jobs posted.
                <Button size="sm" className="mt-4" onClick={() => router.push('/recruiter/jobs/new')}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Post Your First Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}