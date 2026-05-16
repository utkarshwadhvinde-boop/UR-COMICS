import { supabase } from "@/lib/supabase";
import type { Chapter, ChapterPage } from "@/types/index";

export async function listChapters(comicId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("comic_id", comicId)
    .eq("is_published", true)
    .order("chapter_number", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Chapter[];
}

export async function listAllChapters(comicId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("comic_id", comicId)
    .order("chapter_number", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Chapter[];
}

export async function getChapter(id: string): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Chapter;
}

export async function getChapterWithPages(id: string): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*, chapter_pages(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  const chapter = data as Record<string, unknown> & {
    chapter_pages: ChapterPage[];
  };
  const sorted = ((chapter.chapter_pages ?? []) as ChapterPage[]).sort(
    (a, b) => a.page_number - b.page_number,
  );
  return { ...chapter, pages: sorted } as unknown as Chapter;
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("chapter_pages")
    .select("image_url, page_number")
    .eq("chapter_id", chapterId)
    .order("page_number", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ChapterPage[]).map((p) => p.image_url);
}

export async function createChapter(input: {
  comic_id: string;
  chapter_number: number;
  title?: string;
  creator_id?: string;
}): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .insert([{ ...input }] as unknown as never[])
    .select()
    .single();
  if (error) throw error;
  return data as Chapter;
}

export async function publishChapter(id: string): Promise<void> {
  const { error } = await supabase
    .from("chapters")
    .update({
      is_published: true,
      updated_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", id);
  if (error) throw error;
}

export async function updateChapter(
  id: string,
  updates: Partial<Chapter>,
): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Chapter;
}

export async function deleteChapter(id: string): Promise<void> {
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) throw error;
}
