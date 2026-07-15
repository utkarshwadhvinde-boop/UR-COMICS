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
    genres: (raw.comic_genres ?? [])
      .map((cg: any) => cg.genres)
      .filter(Boolean),
  };
}

export async function listComicsByCreator(creatorId: string): Promise<Comic[]> {
  if (!creatorId || creatorId.trim() === "") {
    console.error("listComicsByCreator: creatorId cannot be empty");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .select(`*, comic_genres(genres(*))`)
      .eq("creator_id", creatorId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listComicsByCreator error:", error);
      return [];
    }

    return (data ?? []).map(normalizeComic);
  } catch (error) {
    console.error("listComicsByCreator exception:", error);
    return [];
  }
}

export async function getComic(id: string): Promise<Comic | null> {
  if (!id || id.trim() === "") {
    console.error("getComic: id cannot be empty");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .select(`*, comic_genres(genres(*))`)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code !== "PGRST116") {
        console.error("getComic error:", error);
      }
      return null;
    }

    return data ? normalizeComic(data) : null;
  } catch (error) {
    console.error("getComic exception:", error);
    return null;
  }
}

export async function getTrendingComics(limit = 10): Promise<Comic[]> {
  if (limit < 1) {
    console.error("getTrendingComics: limit must be >= 1");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .select(`*, comic_genres(genres(*))`)
      .eq("status", "published")
      .eq("is_ai_generated", false)
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getTrendingComics error:", error);
      return [];
    }

    return (data ?? []).map(normalizeComic);
  } catch (error) {
    console.error("getTrendingComics exception:", error);
    return [];
  }
}

export async function listComics(limit = 20): Promise<Comic[]> {
  if (limit < 1) {
    console.error("listComics: limit must be >= 1");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .select(`*, comic_genres(genres(*))`)
      .eq("status", "published")
      .eq("is_ai_generated", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("listComics error:", error);
      return [];
    }

    return (data ?? []).map(normalizeComic);
  } catch (error) {
    console.error("listComics exception:", error);
    return [];
  }
}

export async function getComicsByGenre(genreId: string): Promise<Comic[]> {
  if (!genreId || genreId.trim() === "") {
    console.error("getComicsByGenre: genreId cannot be empty");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("comic_genres")
      .select(`comics(*, comic_genres(genres(*)))`)
      .eq("genre_id", genreId);

    if (error) {
      console.error("getComicsByGenre error:", error);
      return [];
    }

    return (data ?? [])
      .map((row: any) => row.comics)
      .filter(Boolean)
      .map(normalizeComic);
  } catch (error) {
    console.error("getComicsByGenre exception:", error);
    return [];
  }
}

export async function searchComics(query: string): Promise<Comic[]> {
  if (!query || query.trim() === "") {
    console.error("searchComics: query cannot be empty");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .select(`*, comic_genres(genres(*))`)
      .eq("status", "published")
      .ilike("title", `%${query}%`)
      .limit(20);

    if (error) {
      console.error("searchComics error:", error);
      return [];
    }

    return (data ?? []).map(normalizeComic);
  } catch (error) {
    console.error("searchComics exception:", error);
    return [];
  }
}

export async function updateComic(
  id: string,
  updates: Partial<Comic>,
): Promise<Comic> {
  if (!id || id.trim() === "") {
    throw new Error("updateComic: id cannot be empty");
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`*, comic_genres(genres(*))`)
      .single();

    if (error) {
      console.error("updateComic error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("updateComic: No data returned");
    }

    return normalizeComic(data);
  } catch (error) {
    console.error("updateComic exception:", error);
    throw error;
  }
}

export async function createComic(input: {
  title: string;
  description?: string;
  cover_url?: string;
  creator_id: string;
  is_ai_generated?: boolean;
  ai_status?: string;
}): Promise<Comic> {
  if (!input.title || input.title.trim() === "") {
    throw new Error("createComic: title is required");
  }

  if (!input.creator_id || input.creator_id.trim() === "") {
    throw new Error("createComic: creator_id is required");
  }

  try {
    const { data, error } = await supabase
      .from("comics")
      .insert([
        {
          ...input,
          status: input.is_ai_generated ? "pending" : "draft",
        },
      ])
      .select(`*, comic_genres(genres(*))`)
      .single();

    if (error) {
      console.error("createComic error:", error);
      throw error;
    }

    if (!data) {
      throw new Error("createComic: No data returned");
    }

    return normalizeComic(data);
  } catch (error) {
    console.error("createComic exception:", error);
    throw error;
  }
}

export async function deleteComic(id: string): Promise<void> {
  if (!id || id.trim() === "") {
    throw new Error("deleteComic: id cannot be empty");
  }

  try {
    const { error } = await supabase.from("comics").delete().eq("id", id);

    if (error) {
      console.error("deleteComic error:", error);
      throw error;
    }
  } catch (error) {
    console.error("deleteComic exception:", error);
    throw error;
  }
}

export async function listGenres(): Promise<Genre[]> {
  try {
    const { data, error } = await supabase
      .from("genres")
      .select("*")
      .order("name");

    if (error) {
      console.error("listGenres error:", error);
      return [];
    }

    return (data ?? []) as Genre[];
  } catch (error) {
    console.error("listGenres exception:", error);
    return [];
  }
}

export async function setComicGenres(
  comicId: string,
  genreIds: string[],
): Promise<void> {
  if (!comicId || comicId.trim() === "") {
    throw new Error("setComicGenres: comicId cannot be empty");
  }

  try {
    // Delete existing genres
    await supabase.from("comic_genres").delete().eq("comic_id", comicId);

    // Insert new genres if any
    if (genreIds.length > 0) {
      const rows = genreIds.map((genre_id) => ({ comic_id: comicId, genre_id }));
      const { error } = await supabase
        .from("comic_genres")
        .insert(rows);

      if (error) {
        console.error("setComicGenres insert error:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("setComicGenres exception:", error);
    throw error;
  }
}
