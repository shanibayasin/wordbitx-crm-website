import { NextRequest, NextResponse } from 'next/server';
import {
  createDemoSessionToken,
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_TTL_SECONDS,
  getDemoAuthConfig,
  securelyMatches,
} from '../../../lib/demoAuth';

export async function POST(request: NextRequest) {
  const config = getDemoAuthConfig();
  if (!config) {
    return NextResponse.json({ error: 'Demo sign-in is not configured on this server.' }, { status: 503 });
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!securelyMatches(email, config.email) || !securelyMatches(body.password, config.password)) {
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + DEMO_SESSION_TTL_SECONDS;
  const response = NextResponse.json({ success: true });
  response.cookies.set(DEMO_SESSION_COOKIE, createDemoSessionToken(config.sessionSecret, expiresAt), {
    httpOnly: true,
    secure: request.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt * 1000),
    maxAge: DEMO_SESSION_TTL_SECONDS,
  });

  return response;
}