import { supabase } from "@/lib/supabase";
import type { Comic, Genre } from "@/types/index";

export async function listComics(limit = 20): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getTrendingComics(limit = 10): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getComic(id: string): Promise<Comic | null> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*`)
    .eq("id", id)
    .single();
  if (error) return null;
  return normalizeComic(data);
}

export async function createComic(input: {
  title: string;
  description?: string;
  cover_url?: string;
  creator_id: string;
}): Promise<Comic> {
  const { data, error } = await supabase
    .from("comics")
    .insert([{ ...input, status: "draft" }] as unknown as never[])
    .select()
    .single();
  if (error) throw error;
  return data as Comic;
}

export async function updateComic(
  id: string,
  updates: Partial<Comic>,
): Promise<Comic> {
  const { data, error } = await supabase
    .from("comics")
    .update({ ...updates } as unknown as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Comic;
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
  return data ?? [];
}

export async function getComicsByGenre(
  genreSlug: string,
  limit = 20,
): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`*, comic_genres!inner(genre_id, genres!inner(id, name, slug))`)
    .eq("status", "published")
    .eq("comic_genres.genres.slug", genreSlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function searchComics(query: string): Promise<Comic[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const { data, error } = await supabase
    .from("comics")
    .select(`*, comic_genres(genre_id, genres(id, name, slug))`)
    .eq("status", "published")
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getUserComics(userId: string): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select("*, comic_genres(genre_id, genres(id, name, slug))")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function setComicGenres(
  comicId: string,
  genreIds: string[],
): Promise<void> {
  await supabase.from("comic_genres").delete().eq("comic_id", comicId);
  if (genreIds.length > 0) {
    const rows = genreIds.map((genre_id) => ({ comic_id: comicId, genre_id }));
    const { error } = await supabase
      .from("comic_genres")
      .insert(rows as unknown as never[]);
    if (error) throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeComic(raw: any): Comic {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? null,
    cover_url: raw.cover_url ?? null,
    creator_id: raw.creator_id,
    status: raw.status,
    created_at: raw.created_at,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: (raw.comic_genres ?? [])
      .map((cg: any) => cg.genres)
      .filter(Boolean),
  };
    }
