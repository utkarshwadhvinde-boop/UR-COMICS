import type {
  ChapterView,
  CreateChapterArgs,
  UpdateChapterDraftArgs,
  backendInterface,
} from "@/backend";

export async function listChapters(
  actor: backendInterface,
  comicId: string,
): Promise<ChapterView[]> {
  return actor.listChapters(comicId);
}

export async function getChapter(
  actor: backendInterface,
  chapterId: string,
): Promise<ChapterView | null> {
  return actor.getChapter(chapterId);
}

export async function createChapter(
  actor: backendInterface,
  args: CreateChapterArgs,
): Promise<ChapterView> {
  return actor.createChapter(args);
}

export async function updateChapterDraft(
  actor: backendInterface,
  chapterId: string,
  args: UpdateChapterDraftArgs,
): Promise<ChapterView> {
  return actor.updateChapterDraft(chapterId, args);
}

export async function deleteChapter(
  actor: backendInterface,
  chapterId: string,
): Promise<void> {
  return actor.deleteChapter(chapterId);
}
