import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Timestamp = bigint;
export interface Comment {
    id: bigint;
    userId: UserId;
    createdAt: Timestamp;
    text: string;
    chapterId?: ChapterId;
    comicId: ComicId;
}
export interface ChapterInput {
    title: string;
    chapterNumber: bigint;
    imageKeys: Array<string>;
    imageOrder: Array<bigint>;
    creatorId: UserId;
    comicId: ComicId;
    chapterStatus: ChapterStatus;
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
export interface UserProfilePublic {
    id: UserId;
    bio?: string;
    username: string;
    totalSeries: bigint;
    createdAt: Timestamp;
    avatarUrl?: string;
    totalCommentsReceived: bigint;
    followerCount: bigint;
    followingCount: bigint;
    totalLikesReceived: bigint;
}
export type ChapterId = bigint;
export type UserId = string;
export type Result = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: ChapterError;
};
export interface CommentReply {
    id: bigint;
    username: string;
    parentCommentId: bigint;
    userId: UserId;
    createdAt: Timestamp;
    text: string;
}
export interface ComicPublic {
    id: ComicId;
    title: string;
    isPremium: boolean;
    createdAt: Timestamp;
    creatorId: UserId;
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
    creatorId: UserId;
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
    imageKeys: Array<string>;
    imageOrder: Array<bigint>;
    createdAt: Timestamp;
    creatorId: UserId;
    publishedAt?: Timestamp;
    comicId: ComicId;
    updatedAt: Timestamp;
    chapterStatus: ChapterStatus;
    images: Array<string>;
}
export interface NotificationPublic {
    id: bigint;
    actorName: string;
    notifType: NotificationType;
    userId: UserId;
    createdAt: Timestamp;
    chapterId?: ChapterId;
    isRead: boolean;
    actorId: UserId;
    comicId?: ComicId;
    commentPreview?: string;
}
export enum ChapterError {
    invalidImages = "invalidImages",
    notFound = "notFound",
    unauthorized = "unauthorized"
}
export enum ChapterStatus {
    published = "published",
    draft = "draft"
}
export enum NotificationType {
    like = "like",
    comment = "comment",
    reply = "reply",
    follow = "follow"
}
export interface backendInterface {
    addComment(userId: UserId, comicId: ComicId, chapterId: ChapterId | null, text: string): Promise<bigint>;
    addReply(parentCommentId: bigint, userId: UserId, username: string, text: string): Promise<CommentReply>;
    approveFAQ(id: bigint): Promise<boolean>;
    bookmarkComic(_id: ComicId): Promise<boolean>;
    cleanupAllDeletedComics(): Promise<void>;
    clearNotifications(userId: UserId): Promise<void>;
    createChapter(input: ChapterInput): Promise<ChapterId>;
    createComic(input: ComicInput): Promise<ComicId>;
    createFAQ(input: FAQInput): Promise<bigint>;
    createOrUpdateProfile(userId: UserId, username: string, avatarUrl: string | null, bio: string | null): Promise<UserProfilePublic>;
    deleteChapter(id: ChapterId): Promise<Result>;
    deleteComic(id: ComicId): Promise<Result>;
    deleteFAQ(id: bigint): Promise<boolean>;
    deleteReadingHistoryEntry(chapterId: ChapterId): Promise<void>;
    followUser(followerId: UserId, followeeId: UserId): Promise<boolean>;
    getChapter(id: ChapterId): Promise<ChapterPublic | null>;
    getChapterLikeCount(chapterId: ChapterId): Promise<bigint>;
    getComic(id: ComicId): Promise<ComicPublic | null>;
    getFirstPublishedChapter(comicId: ComicId): Promise<ChapterPublic | null>;
    getFollowers(userId: UserId): Promise<Array<string>>;
    getFollowing(userId: UserId): Promise<Array<string>>;
    getLikes(id: ComicId): Promise<bigint | null>;
    getNotifications(userId: UserId): Promise<Array<NotificationPublic>>;
    getProfile(userId: UserId): Promise<UserProfilePublic | null>;
    getProgress(userId: UserId, comicId: ComicId): Promise<ReadingProgress | null>;
    getReadingProgress(comicId: ComicId, userId: UserId): Promise<ReadingProgress | null>;
    getTrending(limit: bigint): Promise<Array<ComicPublic>>;
    getUnreadCount(userId: UserId): Promise<bigint>;
    getViews(id: ComicId): Promise<bigint | null>;
    isChapterLiked(userId: UserId, chapterId: ChapterId): Promise<boolean>;
    isFollowing(followerId: UserId, followeeId: UserId): Promise<boolean>;
    likeChapter(userId: UserId, comicId: ComicId, chapterId: ChapterId): Promise<boolean>;
    likeComic(id: ComicId): Promise<boolean>;
    listChapters(comicId: ComicId, publishedOnly: boolean): Promise<Array<ChapterPublic>>;
    listComics(): Promise<Array<ComicPublic>>;
    listComments(comicId: ComicId): Promise<Array<Comment>>;
    listCreatorProfiles(limit: bigint): Promise<Array<UserProfilePublic>>;
    listFAQs(approvedOnly: boolean): Promise<Array<FAQPublic>>;
    listProgress(userId: UserId): Promise<Array<ReadingProgress>>;
    listReplies(parentCommentId: bigint): Promise<Array<CommentReply>>;
    markAllRead(userId: UserId): Promise<void>;
    markRead(userId: UserId, notificationId: bigint): Promise<boolean>;
    publishChapter(id: ChapterId): Promise<Result>;
    saveProgress(userId: UserId, progress: ReadingProgress): Promise<void>;
    submitFAQ(input: FAQInput): Promise<bigint>;
    unbookmarkComic(_id: ComicId): Promise<boolean>;
    unfollowUser(followerId: UserId, followeeId: UserId): Promise<boolean>;
    unlikeChapter(userId: UserId, chapterId: ChapterId): Promise<boolean>;
    unlikeComic(id: ComicId): Promise<boolean>;
    unpublishChapter(id: ChapterId): Promise<Result>;
    updateChapter(id: ChapterId, input: ChapterInput): Promise<Result>;
    updateChapterOrder(id: ChapterId, newImageOrder: Array<bigint>): Promise<Result>;
    updateComic(id: ComicId, input: ComicInput): Promise<boolean>;
    updateFAQ(id: bigint, input: FAQInput): Promise<boolean>;
    updateReadingProgress(comicId: ComicId, chapterId: ChapterId, userId: UserId): Promise<void>;
    viewComic(id: ComicId): Promise<boolean>;
    voteFAQ(id: bigint): Promise<boolean>;
}
