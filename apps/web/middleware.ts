import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    // Auth0 routes must always be included
    "/auth/:path*",
    // Add your protected routes here
    "/dashboard/:path*",
    "/profile/:path*",
    "/post-login",
  ],
};
