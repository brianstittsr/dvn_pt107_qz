import { getAuthInstance } from "@/lib/firebase";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAuthInstance().currentUser?.getIdToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(path, { ...init, headers });
  const json = (await res.json()) as { data?: T; error?: string };
  if (!res.ok) {
    throw new Error(json.error ?? `Request failed with status ${res.status}`);
  }
  return json.data as T;
}
