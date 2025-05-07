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

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    
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
      <div className="absolute top-12 right-12 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob"></div>
      <div className="absolute bottom-12 left-12 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-4xl opacity-25 animate-blob animation-delay-4000"></div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
      
      <div className="container max-w-5xl mx-auto px-4 py-8 relative z-10"> 
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-10 text-center" 
        >
          <div className="flex justify-center mb-6"> 
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="bg-gradient-to-br from-primary to-indigo-600 p-4 rounded-xl shadow-lg shadow-primary/20 group" // Reduced padding, rounded
            >
              <Building2 className="h-12 w-12 text-white group-hover:scale-110 transition-transform" /> 
            </motion.div>
          </div>
          <h1 className="text-xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-600 to-purple-600"> {/* Reduced font size, mb */}
            Welcome to HireHub
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-light">
            Select your path and begin your professional journey today
          </p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mt-4" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-full flex items-center gap-1 shadow-sm"> {/* Reduced padding, font size, gap */}
              <Sparkles className="w-3 h-3 text-indigo-500" /> 
              AI-Powered Matching
            </span>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-full flex items-center gap-1 shadow-sm"> {/* Reduced padding, font size, gap */}
              <Rocket className="w-3 h-3 text-indigo-500" /> 
              Smart Career Tools
            </span>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          className="grid gap-5 md:grid-cols-2 max-w-3xl mx-auto" // Reduced gap, max-w
        >
          <motion.div variants={item} className="group mr-3">
            <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg bg-white/90 backdrop-blur-sm"> {/* Reduced shadow, rounded */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
              <div className="p-5"> 
                <div className="flex items-start mb-4"> 
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300"> {/* Reduced size, rounded */}
                    <Users className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" /> {/* Reduced icon size */}
                  </div>
                  <div className="ml-auto p-1.5 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"> {/* Reduced padding, translate */}
                    <ChevronRight className="w-3.5 h-3.5 text-primary" /> 
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1.5 text-gray-800 group-hover:text-primary transition-colors">I'm a Recruiter</h2> {/* Reduced font size, mb */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed"> {/* Reduced font size, mb */}
                    Post jobs and find talented candidates. Streamline your hiring with AI tools.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4"> 
                  <div className="flex items-center gap-1 text-xs bg-primary/5 text-primary px-2.5 py-0.5 rounded-full font-medium"> {/* Reduced gap, padding */}
                    <Briefcase className="w-3 h-3" /> 
                    <span>Post Jobs</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-primary/5 text-primary px-2.5 py-0.5 rounded-full font-medium"> {/* Reduced gap, padding */}
                    <Users className="w-3 h-3" />
                    <span>Track Applications</span>
                  </div>
                </div>
                <Button 
                  className="w-full py-3 mt-2 bg-gradient-to-r from-primary to-blue-600 hover:brightness-105 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-primary/20 transition-all" // Reduced padding, font size, rounded
                  onClick={() => router.push("/recruiter/auth/register")}
                >
                  Continue as Recruiter
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Job Seeker Card */}
          <motion.div variants={item} className="group">
            <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg bg-white/90 backdrop-blur-sm"> {/* Reduced shadow, rounded */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
              <div className="p-5"> 
                <div className="flex items-start mb-4"> 
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/15 transition-colors duration-300"> {/* Reduced size, rounded */}
                    <UserCircle className="w-7 h-7 text-indigo-500 group-hover:scale-110 transition-transform" /> {/* Reduced icon size */}
                  </div>
                  <div className="ml-auto p-1.5 bg-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"> {/* Reduced padding, translate */}
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500" /> 
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1.5 text-gray-800 group-hover:text-indigo-500 transition-colors">I'm a Job Seeker</h2> {/* Reduced font size, mb */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed"> 
                    Find and apply for your dream job. Take the next step with personalized recommendations.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4"> 
                  <div className="flex items-center gap-1 text-xs bg-indigo-500/5 text-indigo-500 px-2.5 py-0.5 rounded-full font-medium"> {/* Reduced gap, padding */}
                    <Search className="w-3 h-3" /> 
                    <span>Search Jobs</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-indigo-500/5 text-indigo-500 px-2.5 py-0.5 rounded-full font-medium"> {/* Reduced gap, padding */}
                    <Bell className="w-3 h-3" /> 
                    <span>Get Alerts</span>
                  </div>
                </div>
                <Button 
                  className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:brightness-105 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-indigo-500/20 transition-all" // Reduced padding, font size, rounded
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
          className="text-center mt-8 text-sm text-gray-500" 
        >
          Already have an account? 
          <Button 
            variant="link" 
            className="text-primary font-medium ml-1 hover:underline p-0 h-auto text-sm" 
            onClick={() => router.push("/candidate/auth/login")}
          >
            Sign in →
          </Button>
        </motion.div>
      </div>
    </div>
  )
}