import { 
  Comic,
  ExternalBlob,
  ReadProgress,
  SaveReadProgressRequest,
  TrendingEntry,
  UpdateProfileRequest,
  UploadStatus,
  UserProfile,
  UserRole,
 } from "../backend";
import type { 
  ChapterView,
  ComicView,
  UploadSession,
  _ImmutableObjectStorageCreateCertificateResult,
  _ImmutableObjectStorageRefillInformation,
  _ImmutableObjectStorageRefillResult,
  backendInterface,
 } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const COVER_1 = ExternalBlob.fromURL("https://picsum.photos/seed/comic1/400/600");
const COVER_2 = ExternalBlob.fromURL("https://picsum.photos/seed/comic2/400/600");
const COVER_3 = ExternalBlob.fromURL("https://picsum.photos/seed/comic3/400/600");

const PAGE_1 = ExternalBlob.fromURL("https://picsum.photos/seed/page1/800/1200");
const PAGE_2 = ExternalBlob.fromURL("https://picsum.photos/seed/page2/800/1200");
const PAGE_3 = ExternalBlob.fromURL("https://picsum.photos/seed/page3/800/1200");

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleComics: ComicView[] = [
  {
    id: "comic-1",
    title: "Shadow Realm Chronicles",
    description: "A dark fantasy epic set in a world where shadows come alive and consume the weak.",
    cover_blob: COVER_1,
    author_id: { toString: () => "aaaaa-aa" } as unknown as Principal,
    created_at: now - BigInt(7 * 24 * 3600 * 1_000_000_000),
    updated_at: now - BigInt(1 * 24 * 3600 * 1_000_000_000),
  },
  {
    id: "comic-2",
    title: "Neon Uprising",
    description: "Cyberpunk rebels fight against a mega-corporation controlling the city's neural grid.",
    cover_blob: COVER_2,
    author_id: { toString: () => "aaaaa-aa" } as unknown as Principal,
    created_at: now - BigInt(14 * 24 * 3600 * 1_000_000_000),
    updated_at: now - BigInt(2 * 24 * 3600 * 1_000_000_000),
  },
  {
    id: "comic-3",
    title: "Crimson Tide",
    description: "An ancient samurai reawakened in modern Tokyo must navigate a world he no longer understands.",
    cover_blob: COVER_3,
    author_id: { toString: () => "aaaaa-aa" } as unknown as Principal,
    created_at: now - BigInt(21 * 24 * 3600 * 1_000_000_000),
    updated_at: now - BigInt(3 * 24 * 3600 * 1_000_000_000),
  },
];

const sampleChapters: ChapterView[] = [
  {
    id: "chapter-1",
    comic_id: "comic-1",
    title: "Into the Dark",
    number: 1,
    is_published: true,
    image_blobs: [PAGE_1, PAGE_2, PAGE_3],
    created_at: now - BigInt(6 * 24 * 3600 * 1_000_000_000),
    updated_at: now - BigInt(1 * 24 * 3600 * 1_000_000_000),
  },
  {
    id: "chapter-2",
    comic_id: "comic-1",
    title: "The First Shadow",
    number: 2,
    is_published: true,
    image_blobs: [PAGE_1, PAGE_2],
    created_at: now - BigInt(3 * 24 * 3600 * 1_000_000_000),
    updated_at: now - BigInt(1 * 24 * 3600 * 1_000_000_000),
  },
];

const sampleUploadSession: UploadSession = {
  chapter_id: "chapter-1",
  status: UploadStatus.draft,
  uploaded_blobs: [],
  started_at: now,
  updated_at: now,
};

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (_hashes: Array<Uint8Array>): Promise<Array<boolean>> => [],

  _immutableObjectStorageBlobsToDelete: async (): Promise<Array<Uint8Array>> => [],

  _immutableObjectStorageConfirmBlobDeletion: async (_blobs: Array<Uint8Array>): Promise<void> => undefined,

  _immutableObjectStorageCreateCertificate: async (_blobHash: string): Promise<_ImmutableObjectStorageCreateCertificateResult> => ({
    method: "",
    blob_hash: _blobHash,
  }),

  _immutableObjectStorageRefillCashier: async (_refillInformation: _ImmutableObjectStorageRefillInformation | null): Promise<_ImmutableObjectStorageRefillResult> => ({}),

  _immutableObjectStorageUpdateGatewayPrincipals: async (): Promise<void> => undefined,

  _initializeAccessControl: async (): Promise<void> => undefined,

  assignCallerUserRole: async (_user: Principal, _role: UserRole): Promise<void> => undefined,

  beginUpload: async (_chapter_id: string): Promise<UploadSession> => ({
    ...sampleUploadSession,
    chapter_id: _chapter_id,
    status: UploadStatus.uploading,
  }),

  commitUpload: async (_chapter_id: string): Promise<ChapterView> => ({
    ...sampleChapters[0],
    id: _chapter_id,
    is_published: true,
  }),

  createChapter: async (args): Promise<ChapterView> => ({
    id: "new-chapter-" + Date.now(),
    comic_id: args.comic_id,
    title: args.title,
    number: args.number,
    is_published: false,
    image_blobs: [],
    created_at: now,
    updated_at: now,
  }),

  createComic: async (args): Promise<ComicView> => ({
    id: "new-comic-" + Date.now(),
    title: args.title,
    description: args.description,
    cover_blob: args.cover_blob,
    author_id: { toString: () => "aaaaa-aa" } as unknown as Principal,
    created_at: now,
    updated_at: now,
  }),

  deleteChapter: async (_id: string): Promise<void> => undefined,

  deleteComic: async (_id: string): Promise<void> => undefined,

  getCallerUserRole: async (): Promise<UserRole> => UserRole.user,

  getChapter: async (id: string): Promise<ChapterView | null> =>
    sampleChapters.find((c) => c.id === id) ?? sampleChapters[0],

  getComic: async (id: string): Promise<ComicView | null> =>
    sampleComics.find((c) => c.id === id) ?? sampleComics[0],

  isCallerAdmin: async (): Promise<boolean> => false,

  listChapters: async (_comic_id: string): Promise<Array<ChapterView>> => sampleChapters,

  listComics: async (): Promise<Array<ComicView>> => sampleComics,

  registerUploadedImage: async (chapter_id: string, blob: ExternalBlob): Promise<UploadSession> => ({
    ...sampleUploadSession,
    chapter_id,
    uploaded_blobs: [blob],
    status: UploadStatus.uploading,
  }),

  rollbackUpload: async (_chapter_id: string): Promise<bigint> => BigInt(0),

  updateChapterDraft: async (id: string, args): Promise<ChapterView> => ({
    ...sampleChapters[0],
    id,
    title: args.title,
    number: args.number,
  }),

  getMyReadProgress: async (comicId: string): Promise<ReadProgress | null> => ({
    user_id: "user-1",
    comic_id: comicId,
    scroll_pixel_y: BigInt(0),
    chapter_id: "chapter-1",
    last_read_at: now,
  }),

  getMyResumeReading: async (_limit: bigint): Promise<Array<[Comic, ReadProgress]>> => [
    [
      {
        ...sampleComics[0],
        is_deleted: false,
      },
      {
        user_id: "user-1",
        comic_id: sampleComics[0].id,
        scroll_pixel_y: BigInt(1200),
        chapter_id: "chapter-1",
        last_read_at: now - BigInt(3600 * 1_000_000_000),
      },
    ],
  ],

  getTrendingComics: async (_limit: bigint): Promise<Array<TrendingEntry>> =>
    sampleComics.map((c, i) => ({
      comic_id: c.id,
      views: BigInt(1000 - i * 200),
      hot_score: 95 - i * 10,
      last_updated: now,
    })),

  getUserProfile: async (_userId: string): Promise<UserProfile | null> => ({
    id: "user-1",
    display_name: "UR COMICS User",
    handle: "urcomics",
    bio: "Webtoon enthusiast and creator.",
    auth_id: "aaaaa-aa",
    is_creator: true,
    profile_picture_url: undefined,
    created_at: now - BigInt(30 * 24 * 3600 * 1_000_000_000),
    updated_at: now,
  }),

  saveMyReadProgress: async (_req: SaveReadProgressRequest): Promise<void> => undefined,

  updateMyProfile: async (req: UpdateProfileRequest): Promise<UserProfile> => ({
    id: "user-1",
    display_name: req.display_name ?? "UR COMICS User",
    handle: "urcomics",
    bio: req.bio ?? "Webtoon enthusiast and creator.",
    auth_id: "aaaaa-aa",
    is_creator: true,
    profile_picture_url: req.profile_picture_url,
    created_at: now - BigInt(30 * 24 * 3600 * 1_000_000_000),
    updated_at: now,
  }),

  updateComic: async (id: string, args): Promise<ComicView> => ({
    ...sampleComics[0],
    id,
    title: args.title,
    description: args.description,
    cover_blob: args.cover_blob,
  }),
};
