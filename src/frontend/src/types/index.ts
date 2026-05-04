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
  imageOrder: number[];
  chapterStatus: "draft" | "published";
  publishedAt: number | null;
  creatorId: string;
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
  type: "follow" | "like" | "comment" | "reply";
  actorId: string;
  actorName: string;
  comicId?: string;
  chapterId?: string;
  commentPreview?: string;
  createdAt: number;
  isRead: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: number;
  followerCount: number;
  followingCount: number;
  totalSeries: number;
  totalLikesReceived: number;
  totalCommentsReceived: number;
}

export interface Follow {
  followerId: string;
  followeeId: string;
  createdAt: number;
}

export interface ChapterLike {
  userId: string;
  comicId: string;
  chapterId: string;
  createdAt: number;
}

export interface CommentReply {
  id: string;
  parentCommentId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: number;
}
