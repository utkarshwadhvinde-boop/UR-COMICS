import { createActor } from "@/backend";
import type { ComicView, Genre } from "@/backend";
import {
  getComicsByGenre,
  listGenres,
  searchComics,
} from "@/services/comicsService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export const GENRES_QUERY_KEY = ["genres"] as const;
export const COMICS_BY_GENRE_QUERY_KEY = (genreId: string) =>
  ["comics", "genre", genreId] as const;
export const SEARCH_COMICS_QUERY_KEY = (query: string) =>
  ["comics", "search", query] as const;

/** Fallback genre list if backend is not ready or returns empty. */
export const FALLBACK_GENRES: Genre[] = [
  { id: "action", name: "Action", slug: "action" },
  { id: "adventure", name: "Adventure", slug: "adventure" },
  { id: "comedy", name: "Comedy / Funny", slug: "comedy" },
  { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
  { id: "fantasy", name: "Fantasy", slug: "fantasy" },
  { id: "romance", name: "Romance", slug: "romance" },
  { id: "horror", name: "Horror", slug: "horror" },
  { id: "drama", name: "Drama", slug: "drama" },
  { id: "mystery", name: "Mystery", slug: "mystery" },
  { id: "thriller", name: "Thriller", slug: "thriller" },
  { id: "slice-of-life", name: "Slice of Life", slug: "slice-of-life" },
  { id: "martial-arts", name: "Martial Arts", slug: "martial-arts" },
  { id: "supernatural", name: "Supernatural", slug: "supernatural" },
  { id: "psychological", name: "Psychological", slug: "psychological" },
];

/** Fetches the master genre list. Cached for 24 hours — genres are static. */
export function useGenres() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Genre[]>({
    queryKey: GENRES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return FALLBACK_GENRES;
      try {
        const genres = await listGenres(actor);
        return genres.length > 0 ? genres : FALLBACK_GENRES;
      } catch {
        return FALLBACK_GENRES;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
}

/** Fetches comics filtered by a single genre id. */
export function useComicsByGenre(genreId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicView[]>({
    queryKey: COMICS_BY_GENRE_QUERY_KEY(genreId),
    queryFn: async () => {
      if (!actor) return [];
      return getComicsByGenre(actor, genreId);
    },
    enabled: !!actor && !isFetching && genreId.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

/** Full-text search across comic titles, creator names, and genre tags. */
export function useSearchComics(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicView[]>({
    queryKey: SEARCH_COMICS_QUERY_KEY(query),
    queryFn: async () => {
      if (!actor) return [];
      return searchComics(actor, query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: true,
  });
}
