import { G as supabase } from "./index-WeXjJ7Am.js";
async function listChapters(comicId) {
  const { data, error } = await supabase.from("chapters").select("*").eq("comic_id", comicId).eq("is_published", true).order("chapter_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
async function getChapterWithPages(id) {
  const { data, error } = await supabase.from("chapters").select("*, chapter_pages(*)").eq("id", id).single();
  if (error) return null;
  const chapter = data;
  const sorted = (chapter.chapter_pages ?? []).sort(
    (a, b) => a.page_number - b.page_number
  );
  return { ...chapter, pages: sorted };
}
async function createChapter(input) {
  const { data, error } = await supabase.from("chapters").insert([{ ...input, is_published: false }]).select().single();
  if (error) throw error;
  return data;
}
async function updateChapter(id, updates) {
  const { data, error } = await supabase.from("chapters").update({
    ...updates,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
async function deleteChapter(id) {
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) throw error;
}
export {
  createChapter as c,
  deleteChapter as d,
  getChapterWithPages as g,
  listChapters as l,
  updateChapter as u
};
