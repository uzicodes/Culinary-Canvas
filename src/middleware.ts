import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
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

// tells which paths to protect
export const config = {
  matcher: ["/admin/dashboard", "/admin/add-item"],
};