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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Eye, EyeOff, Building2, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

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
        throw new Error(error.error);
      }
  
      const data = await response.json();
      
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', 'recruiter');
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      toast.success('Login successful!');
      router.push('/recruiter/company/setup');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-background">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left panel with enhanced visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
          
          {/* Decorative elements */}
          <div className="absolute top-[25%] right-[10%] w-64 h-64 rounded-full bg-blue-400/20 backdrop-blur-xl" />
          <div className="absolute bottom-[10%] left-[15%] w-80 h-80 rounded-full bg-indigo-500/20 backdrop-blur-xl" />
          
          <div className="relative z-20 flex items-center gap-2 text-xl font-medium">
            <Building2 className="h-7 w-7" />
            <span className="font-bold tracking-tight">HireHub for Recruiters</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative z-20 mt-auto"
          >
            <blockquote className="space-y-4">
              <p className="text-xl leading-relaxed">
                "HireHub has revolutionized our hiring process. The AI-powered candidate matching and streamlined workflows have saved us countless hours."
              </p>
              <footer className="flex items-center gap-4 pt-4">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">David Chen</p>
                  <p className="text-sm opacity-80">Head of Talent Acquisition</p>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </motion.div>
        
        {/* Right panel with form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 lg:p-8"
        >
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
            <div className="flex flex-col space-y-2 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground px-4">
                Sign in to your recruiter account to manage jobs and candidates
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Link href="/recruiter/auth/forgot-password" className="text-xs text-blue-600 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            className="h-11"
                            {...field}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Remember me for 30 days</FormLabel>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
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
                  New to HireHub?
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Don&apos;t have an account?</p>
              <Link
                href="/recruiter/auth/register"
                className="text-blue-600 hover:text-blue-500 font-medium text-sm hover:underline"
              >
                Create a recruiter account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}