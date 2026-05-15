export interface Comic {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  author_id: string;
  is_published: boolean;
  view_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  author_name?: string;
  genres?: Genre[];
}

export interface Chapter {
  id: string;
  comic_id: string;
  chapter_number: number;
  title: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  pages?: ChapterPage[];
}

export interface ChapterPage {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  handle: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
  comics?: Comic[];
}

export interface SearchResult {
  comics: Comic[];
  total: number;
}

export interface UploadSession {
  comicId: string;
  chapterId: string;
  uploadedPaths: string[];
  imageUrls: string[];
  isComplete: boolean;
}

export interface Bookmark {
  id: string;
  user_id: string;
  comic_id: string;
  last_chapter_id: string | null;
  last_page_number: number;
  created_at: string;
  updated_at: string;
  comic?: Comic;
}
