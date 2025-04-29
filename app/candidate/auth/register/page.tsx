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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  Mail,
  Phone,
  Code,
  Clock,
  Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  skills: z.string().min(2, 'Skills must be at least 2 characters'),
  experience: z.string().min(1, 'Years of experience is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password must contain at least one uppercase letter'
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Password must contain at least one number'
    ),
  terms: z.boolean().refine((val) => val, 'You must accept the terms'),
});

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      skills: '',
      experience: '',
      password: '',
      terms: false,
    },
    mode: 'onChange',
  });

  const watchPassword = form.watch('password');
  
  // Calculate password strength
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (watchPassword) {
      calculateStrength(watchPassword);
    }
  }, [watchPassword]);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/candidate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
  
      const data = await response.json();
      localStorage.setItem("verifyEmail", data.email);
      localStorage.setItem("verifyToken", data.token);
      toast.success('Account created! Please verify your email.');
      router.push('/auth/verify/candidate');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {/* Modern background with mesh gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-primary-500),0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--color-secondary-500),0.1),transparent_70%)] pointer-events-none"></div>
      
      {/* Decorative elements with more subtle blur */}
      <div className="absolute top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-300/5 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-300/5 mix-blend-multiply filter blur-[60px]" />

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Panel with Image - Full height on desktop but hidden on mobile */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-full flex-col bg-muted text-white lg:flex overflow-hidden"
        >
          {/* Background Image with improved gradient overlay */}
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
          
          {/* Floating glass cards */}
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
          
          {/* Logo Header */}
          <div className="relative z-20 flex items-center gap-2.5 p-8 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">HireHub</span>
            <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">For Candidates</Badge>
          </div>

          {/* Main Headline - Moved higher up */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-20 mx-12 mt-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 leading-tight">Find Your Dream Job</h2>
              <p className="text-white/85 leading-relaxed text-lg max-w-md">
                Join thousands of professionals already advancing their careers with HireHub's AI-powered job matching.
              </p>
              
              {/* Feature bullets instead of testimonial */}
              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-white/90">Personalized job recommendations based on your skills</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-white/90">Direct applications with top companies</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-white/90">Career growth insights and salary trends</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Panel with Form - Improved layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-8 lg:p-12 backdrop-blur-sm"
        >
          <div className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div className="flex flex-col space-y-3 text-center mb-8">
              {/* Enhanced logo/icon with more subtle glow */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 -z-10 h-16 w-16 rounded-full bg-blue-600/20 blur-lg"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                  <User className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
              </div>
              
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                Create Candidate Profile
              </h1>
              
              <p className="text-md text-slate-500">
                Find the perfect job match for your skills and experience
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input 
                              placeholder="John Doe" 
                              {...field} 
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input 
                              type="email"
                              placeholder="you@example.com"
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Phone</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input 
                              placeholder="+1 (555) 000-0000" 
                              {...field} 
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Skills</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Code className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input 
                              placeholder="React, Node.js, TypeScript" 
                              {...field} 
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-slate-500">
                          List your key professional skills separated by commas
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Years of Experience</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input 
                              placeholder="e.g. 5" 
                              {...field} 
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
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
                  transition={{ delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-sm font-medium text-slate-700">Create Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              className="h-12 pl-10 rounded-lg border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                calculateStrength(e.target.value);
                              }}
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
                        
                        {/* Enhanced password strength indicator */}
                        {watchPassword && (
                          <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                    passwordStrength >= level
                                      ? level <= 1
                                        ? 'bg-red-400 animate-pulse'
                                        : level <= 2
                                        ? 'bg-amber-400'
                                        : level <= 3
                                        ? 'bg-emerald-400'
                                        : 'bg-green-500'
                                      : 'bg-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-slate-500 flex items-center">
                              {passwordStrength === 0 && 'Very weak - add more characters'}
                              {passwordStrength === 1 && 'Weak - add numbers or symbols'}
                              {passwordStrength === 2 && 'Moderate - getting better!'}
                              {passwordStrength === 3 && 'Strong - well done!'}
                              {passwordStrength === 4 && (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Very strong password
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                        
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg bg-slate-50/80 border border-slate-100 p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-slate-700">
                            I agree to the{' '}
                            <Link
                              href="/terms"
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              terms and conditions
                            </Link>
                          </FormLabel>
                          <FormMessage className="text-red-500 text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-medium rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Create account</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-500 rounded-full">
                    Already registered?
                  </span>
                </div>
              </div>

              <p className="text-center mt-4">
                <Link
                  href="/candidate/auth/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
                >
                  Sign in to your account
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}