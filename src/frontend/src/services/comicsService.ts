import { supabase } from "@/lib/supabase";
import type { Comic, Genre } from "@/types/index";

export async function listComics(limit = 20): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(`
      *,
      users!author_id(display_name),
      comic_genres(genre_id, genres(id, name, slug))
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getTrendingComics(limit = 10): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select(
      "*, users!author_id(display_name), comic_genres(genre_id, genres(id, name, slug))",
    )
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getComic(id: string): Promise<Comic | null> {
  const { data, error } = await supabase
    .from("comics")
    .select(
      "*, users!author_id(display_name), comic_genres(genre_id, genres(id, name, slug))",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return normalizeComic(data);
}

export async function createComic(input: {
  title: string;
  description?: string;
  cover_url?: string;
  author_id: string;
}): Promise<Comic> {
  const { data, error } = await supabase
    .from("comics")
    .insert([{ ...input, is_published: false }] as unknown as never[])
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
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as unknown as never)
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
    .select(
      "*, users!author_id(display_name), comic_genres!inner(genre_id, genres!inner(id, name, slug))",
    )
    .eq("is_published", true)
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
    .select(
      "*, users!author_id(display_name), comic_genres(genre_id, genres(id, name, slug))",
    )
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order("view_count", { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map(normalizeComic);
}

export async function getUserComics(userId: string): Promise<Comic[]> {
  const { data, error } = await supabase
    .from("comics")
    .select("*, comic_genres(genre_id, genres(id, name, slug))")
    .eq("author_id", userId)
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
    author_id: raw.author_id,
    is_published: raw.is_published,
    view_count: raw.view_count ?? 0,
    metadata: raw.metadata ?? null,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    author_name: raw.users?.display_name ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: (raw.comic_genres ?? [])
      .map((cg: any) => cg.genres)
      .filter(Boolean),
  };
}
