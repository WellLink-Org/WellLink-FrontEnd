import { auth0 } from "../../../../lib/auth0";

const BACKEND_URL = process.env.BACKEND_URL;

async function handler(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth0.getSession();
  const accessToken = session?.tokenSet.accessToken;
  const userId = session?.user?.sub;
  const url = new URL(req.url);
  const queryString = url.search;

  const pathArray = (await params).path;
  let endpoint = pathArray.join("/");

  console.log("Proxy hit:", req.method, endpoint);

  if (endpoint.includes(":userId")) {
    endpoint = endpoint.replace(":userId", userId || "");
  }

  let body: any = undefined;

  if (req.method !== "GET") {
    try {
      const json = await req.json();
      body = JSON.stringify({
        ...json,
        userId: json.userId ?? userId,
      });
    } catch {
      body = undefined;
    }
  }

  const response = await fetch(`${BACKEND_URL}/api/${endpoint}${queryString}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  const data = await response.json();

  return Response.json(data, { status: response.status });
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
