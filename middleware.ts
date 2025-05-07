import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userType = request.cookies.get('userType');

  // Protected routes definition
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/candidate/dashboard') ||
    request.nextUrl.pathname.startsWith('/candidate/profile') ||
    request.nextUrl.pathname.startsWith('/recruiter/dashboard') ||
    request.nextUrl.pathname.startsWith('/recruiter/jobs') ||
    request.nextUrl.pathname.startsWith('/recruiter/company') ||
    request.nextUrl.pathname.startsWith('/recruiter/candidates') ||
    request.nextUrl.pathname.startsWith('/recruiter/settings');

  const isCandidateAuthRoute = 
    request.nextUrl.pathname.startsWith('/candidate/auth/login') ||
    request.nextUrl.pathname.startsWith('/candidate/auth/register');

  const isRecruiterAuthRoute =
    request.nextUrl.pathname.startsWith('/recruiter/auth/login') ||
    request.nextUrl.pathname.startsWith('/recruiter/auth/register');

  // Protect routes - redirect to login if not authenticated
  if (isProtectedRoute && (!token || !userType)) {
    const isRecruiterRoute = request.nextUrl.pathname.startsWith('/recruiter/');
    const loginUrl = new URL(
      isRecruiterRoute ? '/recruiter/auth/login' : '/candidate/auth/login',
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged in users away from auth pages
  // In middleware.ts
  // Redirect logged in users away from auth pages (but allow registration)
  if (isCandidateAuthRoute && token && userType?.value === 'candidate') {
    // Only redirect away from login, not registration
    if (request.nextUrl.pathname.startsWith('/candidate/auth/login')) {
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
    }
  }
    
  if (isRecruiterAuthRoute && token && userType?.value === 'recruiter') {
    // Only redirect away from login, not registration
    if (request.nextUrl.pathname.startsWith('/recruiter/auth/login')) {
      return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }
  }

  return NextResponse.next();
}