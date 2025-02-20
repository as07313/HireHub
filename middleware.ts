// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userType = request.cookies.get('userType');

  // Add recruiter protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/candidate/dashboard') ||
    request.nextUrl.pathname.startsWith('/candidate/profile') ||
    request.nextUrl.pathname.startsWith('/recruiter/dashboard') ||
    request.nextUrl.pathname.startsWith('/recruiter/jobs') ||
    request.nextUrl.pathname.startsWith('/recruiter/company') ||
    request.nextUrl.pathname.startsWith('/recruiter/candidates');

  // Add recruiter auth routes
  const isCandidateAuthRoute = 
    request.nextUrl.pathname.startsWith('/candidate/auth/login') ||
    request.nextUrl.pathname.startsWith('/candidate/auth/register');

  const isRecruiterAuthRoute =
    request.nextUrl.pathname.startsWith('/recruiter/auth/login') ||
    request.nextUrl.pathname.startsWith('/recruiter/auth/register');

  // Check for protected routes access
  if (isProtectedRoute && (!token || !userType)) {
    const loginUrl = new URL(
      userType?.value === 'recruiter' ? '/recruiter/auth/login' : '/candidate/auth/login',
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged in users from auth pages
  if (isCandidateAuthRoute && token && userType?.value === 'candidate') {
    return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
  }

  if (isRecruiterAuthRoute && token && userType?.value === 'recruiter') {
    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/candidate/dashboard/:path*',
    '/candidate/profile/:path*',
    '/candidate/auth/:path*',
    '/recruiter/dashboard/:path*',
    '/recruiter/jobs/:path*',
    '/recruiter/company/:path*',
    '/recruiter/candidates/:path*',
    '/recruiter/auth/:path*'
  ]
};