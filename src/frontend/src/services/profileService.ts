import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types/index";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    handle?: string;
  },
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function getCreatorProfile(
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

export async function markAsCreator(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      is_creator: true,
      updated_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", userId);
  if (error) throw error;
}

export async function saveReadProgress(
  userId: string,
  comicId: string,
  lastChapterId: string,
  lastPageNumber: number,
): Promise<void> {
  const { error } = await supabase.from("bookmarks").upsert(
    {
      user_id: userId,
      comic_id: comicId,
      last_chapter_id: lastChapterId,
      last_page_number: lastPageNumber,
      updated_at: new Date().toISOString(),
    } as unknown as never,
    { onConflict: "user_id,comic_id" },
  );
  if (error) throw error;
}

export async function getReadProgress(
  userId: string,
  comicId: string,
): Promise<{
  last_chapter_id: string | null;
  last_page_number: number;
} | null> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("last_chapter_id, last_page_number")
    .eq("user_id", userId)
    .eq("comic_id", comicId)
    .single();
  if (error) return null;
  return data;
}

export async function getResumeReading(
  userId: string,
  limit = 3,
): Promise<import("@/types/index").Comic[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("comic_id, comics(*)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((b: any) => b.comics).filter(Boolean);
}
