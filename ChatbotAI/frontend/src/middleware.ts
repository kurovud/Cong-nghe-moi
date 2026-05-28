import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/images/placeholder.png') {
    const url = req.nextUrl.clone();
    url.pathname = '/images/placeholder.svg';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/images/:path*',
};
