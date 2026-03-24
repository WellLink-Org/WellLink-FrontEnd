import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Auth0 handle its own routes
  if (pathname.startsWith("/auth")) {
    return await auth0.middleware(request);
  }

  // Check session for protected routes
  const session = await auth0.getSession(request);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

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
