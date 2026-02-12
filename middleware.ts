import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const role = request.cookies.get('user_role')?.value;
  const pathname = request.nextUrl.pathname;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!session || role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect Dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
