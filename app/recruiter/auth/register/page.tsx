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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Users, 
  CheckCircle2, 
  Shield, 
  ArrowRight,
  Loader2,
  Sparkles,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
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

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
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
      const response = await fetch('/api/auth/recruiter/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      localStorage.setItem('verifyEmail', data.email);
      localStorage.setItem('verifyToken', data.token);

      toast.success('Account created! Please verify your email.');
      router.push('/auth/verify/recruiter');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_75%)]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-32 -left-24 h-96 w-96 rounded-full bg-blue-400/20 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute bottom-32 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute -top-24 right-[45%] h-64 w-64 rounded-full bg-purple-300/10 mix-blend-multiply filter blur-[80px]" />

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Panel with Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-full flex-col bg-muted p-12 text-white lg:flex overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1600&auto=format&fit=crop"
              alt="Office team collaborating"
              fill
              priority
              className="object-cover object-center"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/80 to-blue-700/90" />
          </div>
          
          {/* Floating elements */}
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
          
          {/* Logo Header */}
          <div className="relative z-20 flex items-center gap-2.5 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">HireHub</span>
            <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">For Recruiters</Badge>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-20 mt-auto space-y-8"
          >
            {/* Banner text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-4">Transform Your Hiring Process</h2>
              <p className="text-white/85 leading-relaxed">
                Join thousands of companies finding top talent faster and smarter with our AI-powered recruiting platform.
              </p>
            </motion.div>
            
            {/* Features */}
            <div className="rounded-2xl p-6  shadow-xl">
              <div className="mb-5 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Premium Features
              </div>
              
              <div className="space-y-4 text-white/90">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">AI-powered matching</span> - Find perfect candidates with intelligent screening
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">Premium templates</span> - Customizable workflows and job postings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 mt-0.5">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm leading-tight">
                    <span className="font-semibold">Advanced analytics</span> - Comprehensive reporting and insights
                  </p>
                </div>
              </div>
            </div>
            
          </motion.div>
        </motion.div>

        {/* Right Panel with Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 sm:p-8 lg:p-12 backdrop-blur-sm"
        >
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8">
            <div className="flex flex-col space-y-4 text-center">
              {/* Enhanced logo/icon */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 -z-10 h-20 w-20 rounded-full bg-blue-600/20 blur-lg"></div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30 transform transition-transform hover:scale-105 duration-300">
                  <Users className="h-10 w-10 text-white" strokeWidth={1.5} />
                </div>
              </div>
              
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                Create Your Account
              </h1>
              
              <p className="text-md text-slate-600">
                Join as a recruiter and start finding top talent
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Work Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="you@company.com"
                            className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-500">
                          We'll send a verification code to this email
                        </FormDescription>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
                        <FormControl>
                          <div className="relative transition-all duration-200">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all duration-200"
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
                          <div className="mt-3">
                            <div className="flex gap-2 mb-2">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
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
                        
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-medium rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200"
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

            <div className="space-y-4 pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 backdrop-blur-sm px-4 text-slate-400 rounded-full">
                    Already registered?
                  </span>
                </div>
              </div>

              <p className="text-center">
                <Link
                  href="/recruiter/auth/login"
                  className="inline-flex text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline transition-colors"
                >
                  Sign in to your account →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}