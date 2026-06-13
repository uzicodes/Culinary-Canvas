import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

// ── Upstash Rate Limiter ──
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limit only applies to requests (POST, PATCH, DELETE, PUT)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
});

// ── NextAuth handler (admin routes) ──
const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    // Not admin?  redirect
    if (isAdminPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  },
  {
    callbacks: {
      // only runs if the user is logged in
      authorized: ({ token }) => !!token,
    },
  }
);

// ── Combined middleware ──
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate-limit API routes (only mutation requests, NOT GET)
  if (pathname.startsWith("/api")) {
    if (req.method !== "GET") {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too Many Requests" },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    }

    return NextResponse.next();
  }

  // Protect admin routes with NextAuth
  if (pathname.startsWith("/admin")) {
    return (authMiddleware as any)(req);
  }

  return NextResponse.next();
}

//paths to protect
export const config = {
  matcher: ["/admin/dashboard", "/admin/add-item", "/api/:path*"],
};