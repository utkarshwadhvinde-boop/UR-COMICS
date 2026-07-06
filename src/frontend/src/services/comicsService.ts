import { supabase } from "@/lib/supabase";
import type { Comic, Genre } from "@/types/index";

function normalizeComic(raw: any): Comic {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    cover_url: raw.cover_url ?? null,
    creator_id: raw.creator_id,
    author_name: raw.author_name ?? null,
    status: raw.status,
    created_at: raw.created_at,
    view_count: raw.view_count ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: (raw.comic_genres ?? [])
      .map((cg: any) => cg.genres)
      .filter(Boolean),
  };
}

export async function listComicsByCreator(creatorId: string): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Comic[];
}

export async function getComic(id: string): Promise<Comic | null> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .eq("id", id)
    .single();
  if (error) return null;
  return normalizeComic(data);
}

export async function getTrendingComics(limit = 10): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .eq("status", "published")
    .eq("is_ai_generated", false)
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function listComics(limit = 20): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .eq("status", "published")
    .eq("is_ai_generated", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function searchComics(query: string): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .eq("status", "published")
    .ilike("title", `%${query}%`)
    .limit(20);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function updateComic(id: string, updates: Partial<Comic>): Promise<Comic> {
  const { data, error } = await supabase
    .from("comics")
    .update({ ...updates, updated_at: new Date().toISOString() } as unknown as never)
    .eq("id", id)
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .single();
  if (error) throw error;
  return normalizeComic(data);
}

export async function createComic(input: {
  title: string;
  description?: string;
  cover_url?: string;
  creator_id: string;
  is_ai_generated?: boolean;
  ai_status?: string;
}): Promise<Comic> {
  const { data, error } = await supabase
    .from("comics")
    .insert([{ ...input, status: input.is_ai_generated ? "pending" : "draft" }] as unknown as never[])
    .select(`*, genres:comic_genres(genre:genres(*))`)
    .single();
  if (error) throw error;
  return normalizeComic(data);
}

export async function deleteComic(id: string): Promise<void> {
  const { error } = await supabase.from("comics").delete().eq("id", id);
  if (error) throw error;
}

export async function listGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from("genres")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Genre[];
}

export async function setComicGenres(comicId: string, genreIds: string[]): Promise<void> {
  await supabase.from("comic_genres").delete().eq("comic_id", comicId);
  if (genreIds.length > 0) {
    const rows = genreIds.map((genre_id) => ({ comic_id: comicId, genre_id }));
    const { error } = await supabase
      .from("comic_genres")
      .insert(rows as unknown as never[]);
    if (error) throw error;
  }
  }
