import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // API routes always handle their own auth — never redirect them
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // /register is disabled — invite-only platform
  if (pathname.startsWith('/register')) {
    return NextResponse.redirect(new URL('/login?notice=invite-only', request.url))
  }

  // Public routes — always accessible
  const publicPaths = ['/', '/courses', '/about', '/contact', '/login']
  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith('/courses/')
  )

  // Allow public paths and static assets
  if (isPublicPath || pathname.includes('.')) {
    // If logged in and trying to access /login, redirect to dashboard
    if (token && pathname === '/login') {
      const role = token.role as string
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
      if (role === 'TRAINER') return NextResponse.redirect(new URL('/trainer', request.url))
      return NextResponse.redirect(new URL('/student', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes — require authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access
  const role = token.role as string
  if (pathname === '/dashboard') {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
    if (role === 'TRAINER') return NextResponse.redirect(new URL('/trainer', request.url))
    return NextResponse.redirect(new URL('/student', request.url))
  }
  
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/student', request.url))
  }
  if (pathname.startsWith('/trainer') && role !== 'TRAINER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/student', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
