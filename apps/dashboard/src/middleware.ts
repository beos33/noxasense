import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/reset-password' || request.nextUrl.pathname === '/update-password'

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/applications', request.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 