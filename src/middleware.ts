import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ar', 'en'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If request starts with a legacy /ar or /en path, redirect to the clean URL
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      const cleanPath = pathname.replace(new RegExp(`^/${locale}(/|$)`), '/') || '/';
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = cleanPath;
      const response = NextResponse.redirect(newUrl);
      response.cookies.set('locale', locale, { path: '/', maxAge: 31536000 });
      return response;
    }
  }

  // All other clean paths proceed normally without any locale in the URL
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$).*)',
  ],
};