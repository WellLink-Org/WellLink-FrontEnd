import { NextResponse } from "next/server";
import { auth0 } from "../../lib/auth0";
import { userAPI } from "../api/server/userAPI";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const session = await auth0.getSession(req);
    const auth0Id = session?.user.sub;
    const role = url.searchParams.get("role");

    if (auth0Id) {
      const userData = await userAPI.getUserById(auth0Id);

      if (userData) {
        if (!userData.data.role_updated) {
          if (!role) {
            return NextResponse.redirect(
              new URL(
                `/create-account?email=${encodeURIComponent(userData.data.email)}&userId=${auth0Id}`,
                req.url,
              ),
            );
          } else {
            await userAPI.updateRole(auth0Id, role);
          }
        }
      }

      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (err) {
    console.error("Post login failed", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
