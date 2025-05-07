'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Briefcase, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useState, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion'; // Import motion
import { Badge } from '@/components/ui/badge'; // Import Badge

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function CandidateLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/candidate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
  
      if (!response.ok) {
        const error = await response.json();
        // More specific error handling if possible
        throw new Error(error.error || 'Invalid credentials or account not verified.'); 
      }
  
      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', 'candidate');
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      toast.success('Login successful! Redirecting...');
      router.push('/candidate/dashboard'); 

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-primary-500),0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--color-secondary-500),0.1),transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-300/5 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-300/5 mix-blend-multiply filter blur-[60px]" />

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-full flex-col bg-muted text-white lg:flex overflow-y-auto" 
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1600&auto=format&fit=crop"
              alt="Person working on a laptop"
              fill
              priority
              className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-600/90 to-violet-700/95" />
          </div>
          
          <motion.div 
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: [-15, 5, -15], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute right-12 top-32 h-28 w-28 bg-white/10 backdrop-blur-md rounded-2xl rotate-12 shadow-xl border border-white/20"
          />
          <motion.div 
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: [10, -10, 10], opacity: [0.7, 0.8, 0.7] }}
            transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }}
            className="absolute left-10 top-1/3 w-40 h-40 bg-white/10 backdrop-blur-md rounded-2xl -rotate-6 shadow-xl border border-white/20"
          />
          
          <div className="sticky top-0 z-20 p-8 pb-0 backdrop-blur-sm bg-gradient-to-b from-blue-600/95 via-indigo-600/90 to-transparent"> 
            <div className="flex items-center gap-2.5 text-2xl mb-8 mt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold tracking-tight">HireHub</span>
              <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">For Candidates</Badge>
            </div>
          </div>

          <div className="relative z-10 flex-grow flex flex-col justify-center px-12 mt-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-auto pt-8" 
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome Back!</h2>
                <p className="text-white/85 leading-relaxed text-lg max-w-md">
                  Sign in to access your dashboard, track applications, and discover new job opportunities tailored for you.
                </p>
                
                <div className="mt-12 space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-white/90">Track your job applications status</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-white/90">Get personalized job alerts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-white/90">Manage your profile and resumes</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-auto pb-12 text-center text-white/60 text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Powered by AI Matching</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="p-6 sm:p-8 lg:p-10 backdrop-blur-sm overflow-y-auto"
        >
          <div className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <div className="relative mx-auto">
                <div className="absolute inset-0 -z-10 h-14 w-14 rounded-full bg-blue-600/15 blur-md"></div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/15">
                  <Lock className="h-7 w-7 text-white" strokeWidth={1.5} /> 
                </div>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                Candidate Sign In
              </h1>
              <p className="text-sm text-slate-500">
                Enter your credentials to access your account
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> 
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Email Address</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              // Reduced h-10, pl-8, text-sm
                              className="h-10 pl-8 rounded-md border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1"> 
                        <FormLabel className="text-xs font-medium text-slate-700">Password</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              {...field}
                              placeholder="Enter your password"
                              className="h-10 pl-8 rounded-md border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm" 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              // Reduced padding
                              className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-slate-400 hover:text-slate-800" 
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }} // Adjusted delay
                  className="pt-1" 
                >
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Sign In</span>
                        <ArrowRight className="ml-1.5 h-4 w-4" /> 
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            {/* Reduced mt-5 */}
            <div className="mt-5"> 
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-50 px-3 text-slate-500 rounded-full"> 
                    New to HireHub?
                  </span>
                </div>
              </div>

              <p className="text-center mt-3"> 
                <Link
                  href="/candidate/auth/register" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline transition-colors" 
                >
                  Create an account
                  <ArrowRight className="ml-1 h-3 w-3" /> 
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}