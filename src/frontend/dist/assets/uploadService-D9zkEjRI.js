import { G as supabase } from "./index-WeXjJ7Am.js";
const BUCKET = "comics";
async function uploadChapterPage(comicId, chapterId, pageIndex, file) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${comicId}/${chapterId}/${String(pageIndex).padStart(4, "0")}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
async function uploadCoverImage(comicId, file) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${comicId}/cover.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
async function commitChapterUpload(chapterId, imageUrls, onProgress) {
  const pages = imageUrls.map((image_url, i) => ({
    chapter_id: chapterId,
    page_number: i + 1,
    image_url
  }));
  const batchSize = 20;
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const { error: error2 } = await supabase.from("chapter_pages").insert(batch);
    if (error2) throw error2;
  }
  const { error } = await supabase.from("chapters").update({
    is_published: true,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", chapterId);
  if (error) throw error;
}
async function rollbackChapterUpload(_comicId, chapterId, uploadedPaths) {
  if (uploadedPaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(uploadedPaths);
  }
  await supabase.from("chapters").delete().eq("id", chapterId);
}
export {
  uploadChapterPage as a,
  commitChapterUpload as c,
  rollbackChapterUpload as r,
  uploadCoverImage as u
};
