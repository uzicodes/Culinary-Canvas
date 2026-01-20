import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

    // If the user is trying to access an admin page but isn't an admin, redirect them
    if (isAdminPath && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  },
  {
    callbacks: {
      // This ensures the middleware only runs if the user is logged in
      authorized: ({ token }) => !!token,
    },
  }
);

// This tells the middleware which paths to protect
export const config = {
  matcher: ["/admin/dashboard", "/admin/add-item"],
};