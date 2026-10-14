import { NextRequest, NextResponse } from 'next/server';
import { DEMO_SESSION_COOKIE } from '../../../lib/demoAuth';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}