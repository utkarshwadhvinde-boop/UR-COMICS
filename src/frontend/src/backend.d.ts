import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface UpdateComicArgs {
    title: string;
    cover_blob: ExternalBlob;
    description: string;
}
export interface UpdateChapterDraftArgs {
    title: string;
    number: number;
}
export type ProfileId = string;
export interface ComicView {
    id: ComicId;
    title: string;
    updated_at: Timestamp;
    cover_blob: ExternalBlob;
    description: string;
    created_at: Timestamp;
    author_id: UserId;
}
export type ChapterId = string;
export interface ChapterView {
    id: ChapterId;
    title: string;
    updated_at: Timestamp;
    created_at: Timestamp;
    comic_id: ComicId;
    is_published: boolean;
    number: number;
    image_blobs: Array<ExternalBlob>;
}
export type UserId = Principal;
export interface SaveReadProgressRequest {
    comic_id: ComicId;
    scroll_pixel_y: bigint;
    chapter_id: ChapterId;
}
export interface UpdateProfileRequest {
    bio?: string;
    profile_picture_url?: string;
    display_name?: string;
}
export type ComicId = string;
export interface TrendingEntry {
    views: bigint;
    last_updated: Timestamp;
    comic_id: ComicId;
    hot_score: number;
}
export interface UploadSession {
    status: UploadStatus;
    updated_at: Timestamp;
    chapter_id: ChapterId;
    uploaded_blobs: Array<ExternalBlob>;
    started_at: Timestamp;
}
export interface CreateComicArgs {
    title: string;
    cover_blob: ExternalBlob;
    description: string;
}
export interface Comic {
    id: ComicId;
    title: string;
    updated_at: Timestamp;
    cover_blob: ExternalBlob;
    description: string;
    created_at: Timestamp;
    author_id: UserId;
    is_deleted: boolean;
}
export interface ReadProgress {
    user_id: ProfileId;
    comic_id: ComicId;
    scroll_pixel_y: bigint;
    chapter_id: ChapterId;
    last_read_at: Timestamp;
}
export interface UserProfile {
    id: ProfileId;
    bio: string;
    updated_at: Timestamp;
    created_at: Timestamp;
    profile_picture_url?: string;
    display_name: string;
    auth_id: string;
    handle: string;
    is_creator: boolean;
}
export interface CreateChapterArgs {
    title: string;
    comic_id: ComicId;
    number: number;
}
export enum UploadStatus {
    published = "published",
    uploading = "uploading",
    draft = "draft",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    beginUpload(chapter_id: ChapterId): Promise<UploadSession>;
    commitUpload(chapter_id: ChapterId): Promise<ChapterView>;
    createChapter(args: CreateChapterArgs): Promise<ChapterView>;
    createComic(args: CreateComicArgs): Promise<ComicView>;
    deleteChapter(id: ChapterId): Promise<void>;
    deleteComic(id: ComicId): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getChapter(id: ChapterId): Promise<ChapterView | null>;
    getComic(id: ComicId): Promise<ComicView | null>;
    getMyReadProgress(comicId: ComicId): Promise<ReadProgress | null>;
    getMyResumeReading(limit: bigint): Promise<Array<[Comic, ReadProgress]>>;
    getTrendingComics(limit: bigint): Promise<Array<TrendingEntry>>;
    getUserProfile(userId: string): Promise<UserProfile | null>;
    incrementComicViews(comicId: ComicId): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listChapters(comic_id: ComicId): Promise<Array<ChapterView>>;
    listComics(): Promise<Array<ComicView>>;
    registerUploadedImage(chapter_id: ChapterId, blob: ExternalBlob): Promise<UploadSession>;
    rollbackUpload(chapter_id: ChapterId): Promise<bigint>;
    saveMyReadProgress(req: SaveReadProgressRequest): Promise<void>;
    updateChapterDraft(id: ChapterId, args: UpdateChapterDraftArgs): Promise<ChapterView>;
    updateComic(id: ComicId, args: UpdateComicArgs): Promise<ComicView>;
    updateMyProfile(req: UpdateProfileRequest): Promise<UserProfile>;
}
