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
  Building2, 
  Users, 
  ArrowRight, 
  Loader2,
  Sparkles, 
  BarChart3, 
  Briefcase, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useState, useEffect } from 'react'; // Added useEffect
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge'; // Import Badge

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true, 
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/recruiter/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
  
      if (!response.ok) {
        const error = await response.json();
        // Use error message from API or default
        throw new Error(error.error || 'Invalid credentials or account not verified.'); 
      }
  
      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', 'recruiter');
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      toast.success('Login successful! Redirecting...');
      // Redirect to recruiter dashboard or setup page
      router.push('/recruiter/dashboard'); // Or '/recruiter/company/setup'
      router.refresh(); // Optional: Force refresh
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_75%)]"></div>
      
      <div className="absolute top-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute bottom-32 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute -top-24 right-[45%] h-64 w-64 rounded-full bg-purple-300/10 mix-blend-multiply filter blur-[80px]" />

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-full flex-col bg-muted p-12 text-white lg:flex overflow-hidden"
        >

          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1600&auto=format&fit=crop" // Recruiter relevant image
              alt="Office team collaborating"
              fill
              priority
              className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/80 to-blue-700/90" />
          </div>
          

          <motion.div 
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: [-15, 5, -15], opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute right-12 top-32 h-32 w-32 bg-white/10 backdrop-blur-md rounded-2xl rotate-12 shadow-xl border border-white/20"
          />
          <motion.div 
            initial={{ y: 0, opacity: 0.7 }}
            animate={{ y: [10, -10, 10], opacity: [0.7, 0.8, 0.7] }}
            transition={{ repeat: Infinity, duration: 7, delay: 1, ease: "easeInOut" }}
            className="absolute left-10 bottom-40 w-40 h-40 bg-white/10 backdrop-blur-md rounded-2xl -rotate-12 shadow-xl border border-white/20"
          />
          

          <div className="relative z-20 flex items-center gap-2.5 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
              <Building2 className="h-5 w-5" /> 
            </div>
            <span className="font-bold tracking-tight">HireHub</span>
            <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">For Recruiters</Badge> {/* Recruiter Badge */}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-20 mt-auto space-y-8"
          >
            {/* Banner text - Adjusted for Login */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-4">Welcome Back, Recruiter!</h2>
              <p className="text-white/85 leading-relaxed">
                Sign in to manage your job postings, review candidates, and leverage powerful hiring tools.
              </p>
            </motion.div>
            
            <div className="rounded-2xl p-6 shadow-xl">
              <div className="mb-5 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Your Hiring Dashboard Awaits
              </div>
              
              <div className="space-y-4 text-white/90">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">Access Candidate Pool</span> - Review profiles matched by AI
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">Manage Job Postings</span> - Update listings and track performance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">View Hiring Analytics</span> - Gain insights into your recruitment funnel
                  </p>
                </div>
              </div>
            </div>
            
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-8 lg:p-12 backdrop-blur-sm" 
        >
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6"> 
            <div className="flex flex-col space-y-3 text-center"> 
              <div className="relative mx-auto">
                <div className="absolute inset-0 -z-10 h-16 w-16 rounded-full bg-blue-600/20 blur-lg"></div> 
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30 transform transition-transform hover:scale-105 duration-300"> 
                  <Lock className="h-8 w-8 text-white" strokeWidth={1.5} /> 
                </div>
              </div>
              
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900"> 
                Recruiter Sign In
              </h1>
              
              <p className="text-sm text-slate-600"> 
                Enter your credentials to access your dashboard
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> 
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1"> 
                        <FormLabel className="text-sm font-medium text-slate-700">Work Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="you@company.com" 
                            {...field} 
                            className="h-11 rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200" 
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" /> 
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1"> 
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
  
                        </div>
                        <FormControl>
                          <div className="relative transition-all duration-200">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className="h-11 rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200" 
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-800"
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
                        <FormMessage className="text-xs text-red-500" /> 
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                 <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }} // Adjusted delay
                >
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2.5 space-y-0"> 
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="remember" // Add id for label association
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <FormLabel htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer"> 
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }} // Adjusted delay
                  className="pt-2" // Keep padding consistent
                >
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200" 
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
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="space-y-3 pt-2"> 
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 backdrop-blur-sm px-4 text-slate-400 rounded-full">
                    New to HireHub?
                  </span>
                </div>
              </div>

              <p className="text-center">
                <Link
                  // Link to recruiter registration page
                  href="/recruiter/auth/register" 
                  className="inline-flex text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline transition-colors"
                >
                  Create a recruiter account →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}