import { create } from "zustand";
import {
  clearUser,
  loadAllProgress,
  loadDarkMode,
  loadUser,
  saveDarkMode,
  saveProgress,
  saveUser,
} from "../lib/localStorage";
import { SAMPLE_COMICS } from "../lib/sampleData";
import type { Comic, Notification, ReadingProgress, User } from "../types";

const DEMO_MODE_KEY = "ur_demo_mode";

function loadDemoMode(): boolean {
  try {
    return localStorage.getItem(DEMO_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

function saveDemoModeStorage(enabled: boolean): void {
  try {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Comics (merged: sample + user-created)
  comics: Comic[];
  addComic: (comic: Comic) => void;
  updateComic: (id: string, updates: Partial<Comic>) => void;
  deleteComic: (id: string) => void;
  likeComic: (comicId: string) => void;
  bookmarkComic: (comicId: string) => void;

  // Demo mode — owner/dev only, defaults OFF
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;

  // Reading progress
  readingProgress: ReadingProgress[];
  updateProgress: (progress: ReadingProgress) => void;

  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Notifications
  notifications: Notification[];
  markNotificationsRead: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const DEFAULT_USER: User = {
  id: "guest",
  username: "Reader",
  email: "",
  avatar: "",
  coins: 100,
  bookmarks: [],
  likedComics: [],
  readingHistory: [],
  followedCreators: [],
  dailyStreak: 1,
  lastLogin: Date.now(),
  createdAt: Date.now(),
  role: "user",
  bio: "",
  unlockedChapters: [],
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "new_chapter",
    title: "New Chapter Available",
    message: "Rise of Shadows - Chapter 5 is now live!",
    isRead: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: "n2",
    type: "coins",
    title: "Daily Bonus!",
    message: "You earned 10 coins for logging in today.",
    isRead: false,
    createdAt: Date.now() - 7200000,
  },
];

export const useAppStore = create<AppState>((set, get) => {
  const savedUser = loadUser();
  const savedDark = loadDarkMode();
  const savedProgress = loadAllProgress();
  const savedDemoMode = loadDemoMode();

  // Apply dark mode on initial load
  if (savedDark) {
    document.documentElement.classList.add("dark");
  }

  return {
    currentUser: savedUser ?? DEFAULT_USER,
    isLoggedIn: !!savedUser,
    login: (user) => {
      saveUser(user);
      set({ currentUser: user, isLoggedIn: true });
    },
    logout: () => {
      clearUser();
      set({ currentUser: DEFAULT_USER, isLoggedIn: false });
    },
    updateUser: (updates) => {
      const prev = get().currentUser;
      if (!prev) return;
      const updated = { ...prev, ...updates };
      saveUser(updated);
      set({ currentUser: updated });
    },

    // Comics: empty by default (real data only). Populated with demo data only when demoMode is ON.
    comics: savedDemoMode ? SAMPLE_COMICS : [],
    addComic: (comic) => set((s) => ({ comics: [comic, ...s.comics] })),
    updateComic: (id, updates) =>
      set((s) => ({
        comics: s.comics.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),
    deleteComic: (id) =>
      set((s) => ({ comics: s.comics.filter((c) => c.id !== id) })),
    likeComic: (comicId) => {
      const user = get().currentUser;
      if (!user) return;
      const liked = user.likedComics.includes(comicId);
      const likedComics = liked
        ? user.likedComics.filter((id) => id !== comicId)
        : [...user.likedComics, comicId];
      get().updateUser({ likedComics });
      set((s) => ({
        comics: s.comics.map((c) =>
          c.id === comicId ? { ...c, likes: c.likes + (liked ? -1 : 1) } : c,
        ),
      }));
    },
    bookmarkComic: (comicId) => {
      const user = get().currentUser;
      if (!user) return;
      const bookmarked = user.bookmarks.includes(comicId);
      const bookmarks = bookmarked
        ? user.bookmarks.filter((id) => id !== comicId)
        : [...user.bookmarks, comicId];
      get().updateUser({ bookmarks });
    },

    // Demo mode
    demoMode: savedDemoMode,
    setDemoMode: (enabled) => {
      saveDemoModeStorage(enabled);
      set({
        demoMode: enabled,
        comics: enabled ? SAMPLE_COMICS : [],
      });
    },

    readingProgress: savedProgress,
    updateProgress: (progress) => {
      saveProgress(progress);
      set((s) => {
        const idx = s.readingProgress.findIndex(
          (p) => p.comicId === progress.comicId,
        );
        const next = [...s.readingProgress];
        if (idx >= 0) next[idx] = progress;
        else next.push(progress);
        return { readingProgress: next };
      });
    },

    isDarkMode: savedDark,
    toggleDarkMode: () => {
      const next = !get().isDarkMode;
      saveDarkMode(next);
      document.documentElement.classList.toggle("dark", next);
      set({ isDarkMode: next });
    },

    isSidebarOpen: false,
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

    notifications: MOCK_NOTIFICATIONS,
    markNotificationsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      })),

    searchQuery: "",
    setSearchQuery: (q) => set({ searchQuery: q }),
  };
});
