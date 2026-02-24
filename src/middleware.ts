import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Upstash Rate Limiter ──
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests per 10 seconds
  analytics: true,
});

// ── NextAuth handler (admin routes) ──
const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    // isn't an admin, redirect
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

  // Rate-limit API routes
  if (pathname.startsWith("/api")) {
    const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? "127.0.0.1";
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

    return NextResponse.next();
  }

  // Protect admin routes with NextAuth
  if (pathname.startsWith("/admin")) {
    return (authMiddleware as any)(req);
  }

  return NextResponse.next();
}

// tells which paths to protect
export const config = {
  matcher: ["/admin/dashboard", "/admin/add-item", "/api/:path*"],
};