import type { ReadingProgress, User } from "../types";

const KEYS = {
  USER: "ur_comics_user",
  PROGRESS: "ur_comics_progress",
  DARK_MODE: "ur_comics_dark_mode",
  OWNER_AUTH: "ur_comics_owner_auth",
  STEALTH_MODE: "ur_comics_stealth",
} as const;

// --- User ---
export function saveUser(user: User): void {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function loadUser(): User | null {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(KEYS.USER);
}

// --- Reading Progress ---
export function saveProgress(progress: ReadingProgress): void {
  const all = loadAllProgress();
  const idx = all.findIndex((p) => p.comicId === progress.comicId);
  if (idx >= 0) {
    all[idx] = progress;
  } else {
    all.push(progress);
  }
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(all));
}

export function loadAllProgress(): ReadingProgress[] {
  const raw = localStorage.getItem(KEYS.PROGRESS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReadingProgress[];
  } catch {
    return [];
  }
}

export function loadProgress(comicId: string): ReadingProgress | null {
  return loadAllProgress().find((p) => p.comicId === comicId) ?? null;
}

// --- Dark Mode ---
export function saveDarkMode(isDark: boolean): void {
  localStorage.setItem(KEYS.DARK_MODE, isDark ? "1" : "0");
}

export function loadDarkMode(): boolean {
  return localStorage.getItem(KEYS.DARK_MODE) === "1";
}

// --- Owner Auth ---
export function saveOwnerAuth(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(KEYS.OWNER_AUTH, "1");
  } else {
    sessionStorage.removeItem(KEYS.OWNER_AUTH);
  }
}

export function isOwnerAuthenticated(): boolean {
  return sessionStorage.getItem(KEYS.OWNER_AUTH) === "1";
}

// --- Stealth Mode ---
export function saveStealth(enabled: boolean): void {
  localStorage.setItem(KEYS.STEALTH_MODE, enabled ? "1" : "0");
}

export function loadStealth(): boolean {
  const raw = localStorage.getItem(KEYS.STEALTH_MODE);
  return raw === null ? true : raw === "1";
}
