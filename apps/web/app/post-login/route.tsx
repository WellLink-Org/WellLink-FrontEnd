// app/post-login/route.ts
import { NextResponse } from "next/server";
import { auth0 } from "../../lib/auth0";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const session = await auth0.getSession(req);
    const auth0Id = session?.user.sub;

    const role = url.searchParams.get("role") || "user";

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth0-secret": process.env.AUTH0_SECRET!,
      },
      body: JSON.stringify({ role, auth0Id }),
    });

    // Redirect instantly to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err) {
    console.error("Role update failed", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
