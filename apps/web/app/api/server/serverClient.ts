import { auth0 } from "../../../lib/auth0";

const BACKEND_URL = process.env.BACKEND_URL;

export async function serverClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const session = await auth0.getSession();
  const accessToken = session?.tokenSet.accessToken;

  const response = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "true",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    console.log(response.status);
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
