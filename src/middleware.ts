import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, Next internals, api, and specific files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Canonicalize /ru to root /
  if (pathname === '/ru') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname.startsWith('/ru/')) {
    return NextResponse.redirect(new URL(pathname.replace(/^\/ru/, ''), request.url));
  }

  // Paths starting with /en are handled by [locale=en]
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next();
  }

  // For default Russian locale (no prefix in URL), rewrite internally to /ru/...
  const url = request.nextUrl.clone();
  url.pathname = `/ru${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
