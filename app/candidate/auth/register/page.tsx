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
  Lock,
  Sparkles // Added for footer
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// ... (keep existing schema) ...
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
  // ... (keep existing state and form setup) ...
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
      {/* ... (keep existing background elements) ... */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--color-primary-500),0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--color-secondary-500),0.1),transparent_70%)] pointer-events-none"></div>
      
      <div className="absolute top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-300/5 mix-blend-multiply filter blur-[80px]" />
      <div className="absolute bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-300/5 mix-blend-multiply filter blur-[60px]" />


      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          // Added overflow-y-auto to allow scrolling if content exceeds height, though unlikely with sticky
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
          
          {/* Sticky Container for Header and Main Content */}
          <div className="sticky top-0 z-20 p-8 pb-0 backdrop-blur-sm bg-gradient-to-b from-blue-600/95 via-indigo-600/90 to-transparent"> 
            {/* Logo Header */}
            <div className="flex items-center gap-2.5 text-2xl mb-8 mt-2"> {/* Added margin-bottom */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold tracking-tight">HireHub</span>
              <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">For Candidates</Badge>
            </div>
          </div>

          {/* Main Content Area (Scrollable within the sticky container if needed, but primarily for layout) */}
          <div className="relative z-10 flex-grow flex flex-col justify-center px-12 mt-10"> {/* Use flex-grow and justify-center */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-auto pt-8" // Push content towards center, add padding top
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

            {/* Subtle Footer Element */}
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

        {/* Right Panel with Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="p-6 sm:p-8 lg:p-10 backdrop-blur-sm overflow-y-auto" // Ensure form area is scrollable if needed
        >
          <div className="mx-auto flex w-full max-w-md flex-col justify-center">
            {/* ... (keep existing header) ... */}
            <div className="flex flex-col space-y-2 text-center mb-6"> {/* Reduced space/margin */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 -z-10 h-14 w-14 rounded-full bg-blue-600/15 blur-md"></div> {/* Reduced size/blur */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/15"> {/* Reduced size/shadow */}
                  <User className="h-7 w-7 text-white" strokeWidth={1.5} /> {/* Reduced icon size */}
                </div>
              </div>
              
              <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-900"> {/* Reduced margin/font size */}
                Create Candidate Profile
              </h1>
              
              <p className="text-sm text-slate-500"> {/* Reduced font size */}
                Find the perfect job match for your skills and experience
              </p>
            </div>


            <Form {...form}>
              {/* Reduced space-y-4 */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> 
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Full Name</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input 
                              placeholder="John Doe" 
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
                  // Reduced gap-3
                  className="grid grid-cols-1 md:grid-cols-2 gap-3" 
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Email</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input 
                              type="email"
                              placeholder="you@example.com"
                              // Reduced h-10, pl-8, text-sm
                              className="h-10 pl-8 rounded-md border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm" 
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
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Phone</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input 
                              placeholder="+1 (555) 000-0000" 
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
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Skills</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Code className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input 
                              placeholder="React, Node.js, TypeScript" 
                              {...field} 
                              // Reduced h-10, pl-8, text-sm
                              className="h-10 pl-8 rounded-md border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm" 
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
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Years of Experience</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input 
                              placeholder="e.g. 5" 
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
                  transition={{ delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      // Reduced space-y-1
                      <FormItem className="space-y-1"> 
                        {/* Reduced text-xs */}
                        <FormLabel className="text-xs font-medium text-slate-700">Create Password</FormLabel> 
                        <FormControl>
                          <div className="relative group">
                            {/* Reduced icon size/position */}
                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" /> 
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              // Reduced h-10, pl-8, text-sm
                              className="h-10 pl-8 rounded-md border-slate-200 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 text-sm" 
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
                        
                        {watchPassword && (
                          // Reduced mt-1.5
                          <div className="mt-1.5"> 
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
                                  {/* Reduced icon size */}
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
                      // Reduced space-x-2.5, p-2.5
                      <FormItem className="flex flex-row items-start space-x-2.5 space-y-0 rounded-md bg-slate-50/80 border border-slate-100 p-2.5"> 
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            // Added mt-0.5
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5" 
                          />
                        </FormControl>
                        {/* Reduced space-y-0.5 */}
                        <div className="space-y-0.5 leading-none"> 
                          {/* Reduced text-xs */}
                          <FormLabel className="text-xs text-slate-700"> 
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
                  // Reduced pt-1
                  className="pt-1" 
                >
                  <Button 
                    type="submit" 
                    // Reduced h-11, text-sm, shadow
                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200" 
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
                        {/* Reduced ml-1.5 */}
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
                  {/* Adjusted background */}
                  <span className="bg-slate-50 px-3 text-slate-500 rounded-full"> 
                    Already registered?
                  </span>
                </div>
              </div>

              {/* Reduced mt-3 */}
              <p className="text-center mt-3"> 
                <Link
                  href="/candidate/auth/login"
                  // Reduced text-xs
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline transition-colors" 
                >
                  Sign in to your account
                  {/* Reduced icon size */}
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
