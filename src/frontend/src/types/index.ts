import type { ExternalBlob, UploadStatus } from "@/backend";

export type {
  ComicId,
  ChapterId,
  UserId,
  GenreId,
  UploadStatus,
  ExternalBlob,
  Genre,
  ComicView,
} from "@/backend";

export interface Comic {
  id: string;
  title: string;
  description: string;
  cover_blob: ExternalBlob;
  author_id: import("@icp-sdk/core/principal").Principal;
  created_at: bigint;
  updated_at: bigint;
  genre_ids: string[];
}

export interface Chapter {
  id: string;
  comic_id: string;
  title: string;
  number: number;
  is_published: boolean;
  image_blobs: ExternalBlob[];
  created_at: bigint;
  updated_at: bigint;
}

export interface UploadSession {
  chapter_id: string;
  status: UploadStatus;
  uploaded_blobs: ExternalBlob[];
  started_at: bigint;
  updated_at: bigint;
}

export interface CreateComicInput {
  title: string;
  description: string;
  cover_blob: ExternalBlob;
  genre_ids: string[];
}

export interface UpdateComicInput {
  title: string;
  description: string;
  cover_blob: ExternalBlob;
  genre_ids: string[];
}

export interface CreateChapterInput {
  comic_id: string;
  title: string;
  number: number;
}

export interface UpdateChapterInput {
  title: string;
  number: number;
}
