import { auth0 } from "../../../../lib/auth0";

const BACKEND_URL = process.env.BACKEND_URL;

async function handler(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth0.getSession();
  const accessToken = session?.tokenSet.accessToken;
  const endpoint = (await params).path.join("/");

  console.log("Proxy hit:", req.method, endpoint);

  const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: req.method !== "GET" ? req.body : undefined,
    duplex: "half" as never,
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
