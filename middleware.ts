import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// --- Configuration ---
const API_RATE_LIMIT_WINDOW_SECONDS = 300; // 5 minutes
const API_MAX_REQUESTS_PER_WINDOW = 10;
const GENERAL_RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute
const GENERAL_MAX_REQUESTS_PER_WINDOW = 60; // For non-API, more generous.

// List of User-Agent patterns to block. Be cautious with generic patterns.
const BLOCKED_USER_AGENTS = [
  /python-requests/i,
  /nmap/i,
  /sqlmap/i,
  /acunetix/i,
  /netsparker/i,
  /bsqlbf/i,
  /nessus/i,
  // Add more specific malicious bot User-Agents as identified
  // Generic patterns like /bot/i, /crawl/i, /spider/i can block legitimate crawlers if not handled carefully with an allowlist.
  // /curl/i and /wget/i can also block legitimate developer tools or scripts.
];

// Allow known good bots (search engines, etc.) to bypass generic blocks
const ALLOWED_BOTS_USER_AGENTS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  /exabot/i,
  /facebot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /twitterbot/i,
  /applebot/i,
  /pinterest/i,
  /vercelbot/i, // Vercel's bot for previews etc.
  /ChatGPT-User/i, // OpenAI's crawler
  /Google-Extended/i, // Google AI
  /ClaudeBot/i, // Anthropic's bot
  /anthropic-ai/i, // Anthropic's bot (alternative)
  /PerplexityBot/i, // Perplexity AI
  /Bytespider/i, // ByteDance
  /CCBot/i, // Common Crawl
  /Omgilibot/i, // Omgili crawler
  /omgili/i, // Omgili crawler (alternative)
  /openai-user/i,
  /perplexitybot/i,
  /gptbot/i,
  /anthropic-ai/i
];

const BLOCKED_PATH_PATTERNS = [
  /\.\.\//, // Path traversal
  /\/\.git/, // Accessing .git folder
  /\/\.env/, // Accessing .env file
  /wp-admin/i, // Common WordPress path, often probed
  /phpmyadmin/i, // Common phpMyAdmin path
];

// Initialize Upstash Redis client
const redis = Redis.fromEnv();

// --- Helper Functions ---
async function applyRateLimit(
  keyPrefix: string,
  ip: string,
  windowSeconds: number,
  maxRequests: number
): Promise<boolean> {
  const key = `${keyPrefix}:${ip}`;
  try {
    const currentRequests = (await redis.get<number>(key)) ?? 0;

    if (currentRequests >= maxRequests) {
      return true; // Rate limit exceeded
    }

    const pipeline = redis.pipeline();
    pipeline.incr(key);
    if (currentRequests === 0) {
      pipeline.expire(key, windowSeconds);
    }
    await pipeline.exec();
    return false; // Not rate limited
  } catch (error) {
    console.error('Upstash Redis error during rate limiting:', error);
    // Fail open in case of Redis error to avoid blocking legitimate users
    return false;
  }
}

// --- Middleware Logic ---
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : request.ip || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') ?? '';

  // --- 1. Basic Bot Detection (User-Agent based) ---
  let isAllowedBot = false;
  for (const pattern of ALLOWED_BOTS_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      isAllowedBot = true;
      break;
    }
  }

  if (!isAllowedBot) {
    for (const pattern of BLOCKED_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        console.warn(`Blocked User-Agent: ${userAgent} from IP: ${ip} for path: ${pathname}`);
        return new NextResponse('Forbidden: Bad User-Agent', { status: 403 });
      }
    }
  }

  // --- 2. Path Sanitization / Blocking ---
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      console.warn(`Blocked path pattern: ${pathname} from IP: ${ip}`);
      return new NextResponse('Forbidden: Malicious Path', { status: 403 });
    }
  }

  // --- 3. Rate Limiting ---
  if (pathname.startsWith('/api/')) {
    const isRateLimited = await applyRateLimit(
      'rate_limit_api',
      ip,
      API_RATE_LIMIT_WINDOW_SECONDS,
      API_MAX_REQUESTS_PER_WINDOW
    );
    if (isRateLimited) {
      console.warn(`API Rate limit exceeded for IP: ${ip} on path: ${pathname}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else {
    // Apply general rate limiting to non-API routes
    const isRateLimited = await applyRateLimit(
      'rate_limit_general',
      ip,
      GENERAL_RATE_LIMIT_WINDOW_SECONDS,
      GENERAL_MAX_REQUESTS_PER_WINDOW
    );
    if (isRateLimited) {
      console.warn(`General Rate limit exceeded for IP: ${ip} on path: ${pathname}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // --- 4. Security Headers ---
  const response = NextResponse.next();

  let scriptSrc = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.google.com https://www.gstatic.com https://googletagmanager.com https://googlesyndication.com https://tpc.googlesyndication.com https://pagead2.googlesyndication.com";
  if (process.env.NODE_ENV === 'development') {
    scriptSrc += " 'unsafe-eval'";
  }

  const cspDirectives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://*.google.com https://www.gstatic.com https://googletagmanager.com https://fonts.googleapis.com https://googlesyndication.com https://www.googletagmanager.com",
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.google.com https://*.google.pl https://google.pl https://www.gstatic.com https://googletagmanager.com https://www.googletagmanager.com https://*.google-analytics.com https://ssl.google-analytics.com https://googlesyndication.com https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com",
    "font-src 'self' data: https://*.google.com https://www.gstatic.com https://googletagmanager.com https://www.googletagmanager.com https://fonts.gstatic.com https://fonts.googleapis.com",
    "connect-src 'self' https://vitals.vercel-insights.com https://*.google-analytics.com https://ssl.google-analytics.com https://*.google.com https://*.supabase.co wss://*.supabase.co https://googletagmanager.com https://www.googletagmanager.com https://googlesyndication.com https://*.doubleclick.net https://stats.g.doubleclick.net https://www.google-analytics.com",
    "frame-src 'self' https://www.google.com https://www.gstatic.com https://recaptcha.google.com https://googletagmanager.com https://googlesyndication.com https://tpc.googlesyndication.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://www.googletagmanager.com",
    "worker-src 'self' blob: https://*.google.com https://www.gstatic.com https://googletagmanager.com https://www.googletagmanager.com",
    "object-src 'none'",
    "frame-ancestors 'self' https://*.google.com https://googletagmanager.com",
    "form-action 'self' https://googletagmanager.com",
    "upgrade-insecure-requests"
  ];
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// --- Middleware Configuration ---
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
