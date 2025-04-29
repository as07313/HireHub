"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCircle, Building2, Briefcase, ChevronRight, Search, Bell, Sparkles, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function RoleSelectionPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // In app/page.tsx
  useEffect(() => {
    // Clear auth on role selection page load
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    
    // Also clear cookies by making a logout request
    fetch('/api/auth/candidate/logout', { method: 'POST' }).catch(() => {});
    fetch('/api/auth/recruiter/logout', { method: 'POST' }).catch(() => {});
    
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      } 
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-slate-50/90 relative overflow-hidden flex items-center">
      {/* Refined background elements */}
      <div className="absolute top-12 right-12 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob"></div>
      <div className="absolute bottom-12 left-12 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob animation-delay-4000"></div>
      
      {/* Glass overlay pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      
      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center mb-8">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="bg-gradient-to-br from-primary to-indigo-600 p-5 rounded-2xl shadow-lg shadow-primary/20 group"
            >
              <Building2 className="h-14 w-14 text-white group-hover:scale-110 transition-transform" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-purple-600">
            Welcome to HireHub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Select your path and begin your professional journey today
          </p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mt-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-sm font-medium rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI-Powered Matching
            </span>
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-sm font-medium rounded-full flex items-center gap-1.5 shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-indigo-500" />
              Smart Career Tools
            </span>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
        >
          {/* Recruiter Card */}
          <motion.div variants={item} className="group">
            <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-auto p-2 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-3 group-hover:translate-x-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">I'm a Recruiter</h2>
                  <p className="text-gray-600 mb-5 text-base leading-relaxed">
                    Post jobs and find talented candidates for your organization. Streamline your hiring process with AI-powered tools.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="flex items-center gap-1.5 text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Post Jobs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>Track Applications</span>
                  </div>
                </div>
                <Button 
                  className="w-full py-5 mt-2 bg-gradient-to-r from-primary to-blue-600 hover:brightness-105 text-white font-medium rounded-lg shadow-sm hover:shadow-primary/20 transition-all"
                  onClick={() => router.push("/recruiter/auth/register")}
                >
                  Continue as Recruiter
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Job Seeker Card */}
          <motion.div variants={item} className="group">
            <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors duration-300">
                    <UserCircle className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="ml-auto p-2 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-3 group-hover:translate-x-0">
                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-indigo-500 transition-colors">I'm a Job Seeker</h2>
                  <p className="text-gray-600 mb-5 text-base leading-relaxed">
                    Find and apply for your dream job opportunities. Take the next step in your career with personalized recommendations.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="flex items-center gap-1.5 text-xs bg-indigo-500/5 text-indigo-500 px-3 py-1 rounded-full font-medium">
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Jobs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-indigo-500/5 text-indigo-500 px-3 py-1 rounded-full font-medium">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Get Alerts</span>
                  </div>
                </div>
                <Button 
                  className="w-full py-5 mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:brightness-105 text-white font-medium rounded-lg shadow-sm hover:shadow-indigo-500/20 transition-all"
                  onClick={() => router.push("/candidate/auth/register")}
                >
                  Continue as Job Seeker
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="text-center mt-10 text-gray-500"
        >
          Already have an account? 
          <Button 
            variant="link" 
            className="text-primary font-medium ml-1 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Sign in →
          </Button>
        </motion.div>
      </div>
    </div>
  )
}