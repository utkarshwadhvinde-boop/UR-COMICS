export type Genre =
  | "Fantasy"
  | "Sci-Fi"
  | "Action"
  | "Romance"
  | "Thriller"
  | "Horror"
  | "Slice of Life"
  | "Comedy"
  | "Drama"
  | "Adventure";

export interface Chapter {
  id: string;
  comicId: string;
  title: string;
  chapterNumber: number;
  pages: string[];
  createdAt: number;
  updatedAt: number;
  isPremium: boolean;
  coinCost: number;
  views: number;
}

export type ComicStatus = "ongoing" | "completed" | "hiatus";

export interface Comic {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  genres: Genre[];
  status: ComicStatus;
  likes: number;
  views: number;
  rating: number;
  chapters: Chapter[];
  createdAt: number;
  updatedAt: number;
  isFeatured: boolean;
  isTrending: boolean;
  isPremium: boolean;
  isPinned: boolean;
  creatorId: string;
  isOwnerComic: boolean;
}

export interface ReadingProgress {
  comicId: string;
  chapterId: string;
  scrollPosition: number;
  lastReadAt: number;
  chapterNumber: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  coins: number;
  bookmarks: string[];
  likedComics: string[];
  readingHistory: ReadingProgress[];
  followedCreators: string[];
  dailyStreak: number;
  lastLogin: number;
  createdAt: number;
  role: "user" | "creator" | "owner";
  bio: string;
  unlockedChapters: string[];
}

export interface Comment {
  id: string;
  comicId: string;
  chapterId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  createdAt: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  upvotes: number;
  isApproved: boolean;
  isPinned?: boolean;
  isUserQuestion?: boolean;
  createdAt: number;
}

export interface CoinPackage {
  id: string;
  coins: number;
  price: number;
  bonus: number;
  label: string;
  isPopular: boolean;
}

export interface Notification {
  id: string;
  type: "new_chapter" | "like" | "comment" | "follow" | "coins";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}
