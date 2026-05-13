import type { ExternalBlob, UploadSession, backendInterface } from "@/backend";

export async function beginUpload(
  actor: backendInterface,
  chapterId: string,
): Promise<UploadSession> {
  return actor.beginUpload(chapterId);
}

export async function registerUploadedImage(
  actor: backendInterface,
  chapterId: string,
  blob: ExternalBlob,
): Promise<UploadSession> {
  return actor.registerUploadedImage(chapterId, blob);
}

export async function commitUpload(
  actor: backendInterface,
  chapterId: string,
): Promise<import("@/backend").ChapterView> {
  return actor.commitUpload(chapterId);
}

export async function rollbackUpload(
  actor: backendInterface,
  chapterId: string,
): Promise<bigint> {
  return actor.rollbackUpload(chapterId);
}
