
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include', // importante si backend usa cookies
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}
