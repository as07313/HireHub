// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const userType = request.cookies.get('userType');

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/candidate/dashboard') ||
    request.nextUrl.pathname.startsWith('/candidate/profile');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/candidate/auth/login') ||
    request.nextUrl.pathname.startsWith('/candidate/auth/register');

  if (isProtectedRoute && (!token || !userType)) {
    const loginUrl = new URL('/candidate/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token && userType?.value === 'candidate') {
    const dashboardUrl = new URL('/candidate/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/candidate/dashboard/:path*',
    '/candidate/profile/:path*',
    '/candidate/auth/:path*'
  ]
};