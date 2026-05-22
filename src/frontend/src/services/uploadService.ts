import { supabase } from "@/lib/supabase";

const BUCKET = "comics";

export async function uploadChapterPage(
  comicId: string,
  chapterId: string,
  pageIndex: number,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${comicId}/${chapterId}/${String(pageIndex).padStart(4, "0")}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadCoverImage(
  comicId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${comicId}/cover.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatarImage(
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export interface UploadSessionState {
  comicId: string;
  chapterId: string;
  uploadedPaths: string[];
  imageUrls: string[];
}

export function beginChapterUpload(
  comicId: string,
  chapterId: string,
): UploadSessionState {
  return { comicId, chapterId, uploadedPaths: [], imageUrls: [] };
}

export async function commitChapterUpload(
  chapterId: string,
  imageUrls: string[],
  onProgress?: (pct: number) => void,
): Promise<void> {
  const pages = imageUrls.map((image_url, i) => ({
    chapter_id: chapterId,
    page_number: i + 1,
    image_url,
  }));

  // Insert in batches of 20
  const batchSize = 20;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const { error } = await supabase
      .from("chapter_pages")
      .insert(batch as unknown as never[]);
    if (error) throw error;
    onProgress?.(((i + batch.length) / pages.length) * 90);
  }

  const { error } = await supabase
  .from("chapters")
  .update({
    updated_at: new Date().toISOString(),
    is_published: true,
  } as unknown as never)
  .eq("id", chapterId);
  onProgress?.(100);
}

export async function rollbackChapterUpload(
  _comicId: string,
  chapterId: string,
  uploadedPaths: string[],
): Promise<void> {
  if (uploadedPaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(uploadedPaths);
  }
  await supabase.from("chapters").delete().eq("id", chapterId);
}

export async function deleteChapterFiles(
  _comicId: string,
  chapterId: string,
): Promise<void> {
  const { data } = await supabase.storage
    .from(BUCKET)
    .list(`${_comicId}/${chapterId}`);
  if (data && data.length > 0) {
    const paths = data.map((f) => `${_comicId}/${chapterId}/${f.name}`);
    await supabase.storage.from(BUCKET).remove(paths);
  }
}
