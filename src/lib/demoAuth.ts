import { createHmac, timingSafeEqual } from 'node:crypto';

export const DEMO_SESSION_COOKIE = 'wordbitx_demo_session';
export const DEMO_SESSION_TTL_SECONDS = 8 * 60 * 60;

type DemoAuthConfig = {
  email: string;
  password: string;
  sessionSecret: string;
};

export function getDemoAuthConfig(): DemoAuthConfig | null {
  const email = process.env.DEMO_LOGIN_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_LOGIN_PASSWORD;
  const sessionSecret = process.env.DEMO_AUTH_SECRET;

  if (!email || !password || !sessionSecret) {
    return null;
  }

  return { email, password, sessionSecret };
}

export function securelyMatches(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export function createDemoSessionToken(sessionSecret: string, expiresAt: number): string {
  const payload = String(expiresAt);
  const signature = createHmac('sha256', sessionSecret).update(payload).digest('base64url');

  return `${payload}.${signature}`;
}

export function isValidDemoSessionToken(token: string | undefined): boolean {
  const config = getDemoAuthConfig();
  if (!config || !token) {
    return false;
  }

  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) {
    return false;
  }

  const expiresAt = Number(payload);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = createHmac('sha256', config.sessionSecret).update(payload).digest();
  const signatureBuffer = Buffer.from(signature, 'base64url');

  return signatureBuffer.length === expectedSignature.length && timingSafeEqual(signatureBuffer, expectedSignature);
}