import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadChapterPage(
  comicId: string,
  chapterId: string,
  pageIndex: number,
  file: File,
): Promise<string> {
  return await uploadToCloudinary(file, `urcomics/${comicId}/${chapterId}`);
}

export async function uploadCoverImage(
  comicId: string,
  file: File,
): Promise<string> {
  return await uploadToCloudinary(file, `urcomics/${comicId}/covers`);
}

export async function uploadAvatarImage(
  userId: string,
  file: File,
): Promise<string> {
  return await uploadToCloudinary(file, `urcomics/avatars/${userId}`);
}

export async function uploadImage(file: File): Promise<string> {
  return await uploadToCloudinary(file, `urcomics/novels`);
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
  if (error) throw error;
  onProgress?.(100);
}

export async function rollbackChapterUpload(
  _comicId: string,
  chapterId: string,
): Promise<void> {
  await supabase.from("chapters").delete().eq("id", chapterId);
}

export async function deleteChapterFiles(
  _comicId: string,
  _chapterId: string,
): Promise<void> {
  // Files are on Cloudinary — deletion handled separately
}
