import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('__Secure-authjs.session-token') ||
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token');

  const isLoggedIn = Boolean(token?.value);
  const isOnLogin = request.nextUrl.pathname === '/login';

  if (isOnLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/orders', request.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)'],
};
