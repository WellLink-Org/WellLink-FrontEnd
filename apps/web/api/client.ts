import { getAccessToken } from "@auth0/nextjs-auth0";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = await getAccessToken();

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
