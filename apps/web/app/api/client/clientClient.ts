// api/clientClient.ts
export async function clientClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/proxy/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text(); // read the actual error
    console.error(`API Error ${response.status}:`, errorBody);
    throw new Error(`API Error: ${response.status} — ${errorBody}`);
  }

  return response.json();
}
