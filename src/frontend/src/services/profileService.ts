import type {
  Comic,
  ReadProgress,
  SaveReadProgressRequest,
  TrendingEntry,
  UpdateProfileRequest,
  UserProfile,
  backendInterface,
} from "@/backend";

export async function getUserProfile(
  actor: backendInterface,
  userId: string,
): Promise<UserProfile | null> {
  return actor.getUserProfile(userId);
}

export async function updateMyProfile(
  actor: backendInterface,
  req: UpdateProfileRequest,
): Promise<UserProfile> {
  return actor.updateMyProfile(req);
}

export async function getMyReadProgress(
  actor: backendInterface,
  comicId: string,
): Promise<ReadProgress | null> {
  return actor.getMyReadProgress(comicId);
}

export async function saveMyReadProgress(
  actor: backendInterface,
  req: SaveReadProgressRequest,
): Promise<void> {
  return actor.saveMyReadProgress(req);
}

export async function getTrendingComics(
  actor: backendInterface,
  limit: number,
): Promise<TrendingEntry[]> {
  return actor.getTrendingComics(BigInt(limit));
}

export async function getMyResumeReading(
  actor: backendInterface,
  limit: number,
): Promise<Array<[Comic, ReadProgress]>> {
  return actor.getMyResumeReading(BigInt(limit));
}
