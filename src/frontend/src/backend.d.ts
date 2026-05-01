import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = string;
export type Timestamp = bigint;
export interface FAQPublic {
    id: bigint;
    upvotes: bigint;
    question: string;
    createdAt: bigint;
    answer: string;
    approved: boolean;
    category: string;
    isUserQuestion: boolean;
}
export interface Comment {
    id: bigint;
    userId: UserId;
    createdAt: Timestamp;
    text: string;
    chapterId?: ChapterId;
    comicId: ComicId;
}
export interface ComicPublic {
    id: ComicId;
    title: string;
    isPremium: boolean;
    createdAt: Timestamp;
    description: string;
    author: string;
    ownerUploaded: boolean;
    isFeatured: boolean;
    genres: Array<string>;
    coverUrl: string;
    likesCount: bigint;
    isPinned: boolean;
    isTrending: boolean;
    viewsCount: bigint;
}
export interface ComicInput {
    title: string;
    isPremium: boolean;
    description: string;
    author: string;
    ownerUploaded: boolean;
    isFeatured: boolean;
    genres: Array<string>;
    coverUrl: string;
    isPinned: boolean;
    isTrending: boolean;
}
export type ComicId = bigint;
export interface ChapterPublic {
    id: ChapterId;
    title: string;
    chapterNumber: bigint;
    createdAt: Timestamp;
    comicId: ComicId;
    updatedAt: Timestamp;
    images: Array<string>;
}
export interface ChapterInput {
    title: string;
    chapterNumber: bigint;
    comicId: ComicId;
    images: Array<string>;
}
export interface ReadingProgress {
    scrollPosition: bigint;
    chapterId: ChapterId;
    comicId: ComicId;
    lastReadAt: Timestamp;
}
export interface FAQInput {
    question: string;
    answer: string;
    category: string;
    isUserQuestion: boolean;
}
export type ChapterId = bigint;
export interface backendInterface {
    addComment(userId: UserId, comicId: ComicId, chapterId: ChapterId | null, text: string): Promise<bigint>;
    approveFAQ(id: bigint): Promise<boolean>;
    bookmarkComic(_id: ComicId): Promise<boolean>;
    createChapter(input: ChapterInput): Promise<ChapterId>;
    createComic(input: ComicInput): Promise<ComicId>;
    createFAQ(input: FAQInput): Promise<bigint>;
    deleteChapter(id: ChapterId): Promise<boolean>;
    deleteComic(id: ComicId): Promise<boolean>;
    deleteFAQ(id: bigint): Promise<boolean>;
    getChapter(id: ChapterId): Promise<ChapterPublic | null>;
    getComic(id: ComicId): Promise<ComicPublic | null>;
    getLikes(id: ComicId): Promise<bigint | null>;
    getProgress(userId: UserId, comicId: ComicId): Promise<ReadingProgress | null>;
    getTrending(limit: bigint): Promise<Array<ComicPublic>>;
    getViews(id: ComicId): Promise<bigint | null>;
    likeComic(id: ComicId): Promise<boolean>;
    listChapters(comicId: ComicId): Promise<Array<ChapterPublic>>;
    listComics(): Promise<Array<ComicPublic>>;
    listComments(comicId: ComicId): Promise<Array<Comment>>;
    listFAQs(approvedOnly: boolean): Promise<Array<FAQPublic>>;
    listProgress(userId: UserId): Promise<Array<ReadingProgress>>;
    saveProgress(userId: UserId, progress: ReadingProgress): Promise<void>;
    submitFAQ(input: FAQInput): Promise<bigint>;
    unbookmarkComic(_id: ComicId): Promise<boolean>;
    unlikeComic(id: ComicId): Promise<boolean>;
    updateChapter(id: ChapterId, input: ChapterInput): Promise<boolean>;
    updateComic(id: ComicId, input: ComicInput): Promise<boolean>;
    updateFAQ(id: bigint, input: FAQInput): Promise<boolean>;
    viewComic(id: ComicId): Promise<boolean>;
    voteFAQ(id: bigint): Promise<boolean>;
}
