'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
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
  Loader2
} from 'lucide-react';
import { useState } from 'react';
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

  // Update strength when password changes
  useState(() => {
    if (watchPassword) {
      calculateStrength(watchPassword);
    }
  });

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
      // Store verification data in localStorage
      localStorage.setItem('verifyEmail', data.email);
      localStorage.setItem('verifyToken', data.token);

      toast.success('Account created! Please verify your email.');
      // Redirect to the recruiter verification page
      router.push('/auth/verify/recruiter');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-background">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Enhanced Left Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl" />
          
          <div className="relative z-20 flex items-center gap-2 text-xl font-medium">
            <Building2 className="h-8 w-8" />
            <span className="font-bold tracking-tight">HireHub for Recruiters</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative z-20 mt-auto space-y-6"
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Shield className="h-3 w-3 mr-1" /> Recruiter Benefits
            </Badge>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                <p className="text-sm">Advanced AI-powered candidate matching and screening</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                <p className="text-sm">Customizable job posting templates and workflows</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                <p className="text-sm">Comprehensive analytics and reporting tools</p>
              </div>
            </div>
            
            <blockquote className="space-y-4 border-l-2 border-white/40 pl-4 mt-8">
              <p className="text-lg leading-relaxed">
                "Since implementing HireHub, we've reduced our time-to-hire by 40% and significantly improved the quality of our candidates."
              </p>
              <footer className="text-sm opacity-90">
                <p className="font-semibold">Sarah Miller</p>
                <p>Talent Acquisition Director</p>
              </footer>
            </blockquote>
          </motion.div>
        </motion.div>

        {/* Enhanced Right Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 lg:p-8"
        >
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create a Recruiter Account
              </h1>
              <p className="text-sm text-muted-foreground px-4">
                Start hiring top talent with HireHub's intelligent recruitment platform
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="you@company.com"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll send a verification code to this email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            className="h-11"
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
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password strength indicator */}
                      {watchPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full ${
                                  passwordStrength >= level
                                    ? level <= 1
                                      ? 'bg-red-500'
                                      : level <= 2
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {passwordStrength === 0 && 'Very weak password'}
                            {passwordStrength === 1 && 'Weak password'}
                            {passwordStrength === 2 && 'Moderate password'}
                            {passwordStrength === 3 && 'Strong password'}
                            {passwordStrength === 4 && 'Very strong password'}
                          </p>
                        </div>
                      )}
                      
                      <FormDescription>
                        At least 8 characters with uppercase and numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{' '}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            terms and conditions
                          </Link>
                        </FormLabel>
                        <FormDescription>
                          By creating an account, you agree to our privacy policy
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already registered?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Have an account?{' '}
              <Link
                href="/recruiter/auth/login"
                className="text-blue-600 hover:text-blue-500 hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}