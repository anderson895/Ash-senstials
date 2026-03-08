import type { User } from "../types";

const SESSION_KEY = "ashentials_user";

export function saveSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
