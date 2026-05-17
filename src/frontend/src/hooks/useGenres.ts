import {
  getComicsByGenre,
  listGenres,
  searchComics,
} from "@/services/comicsService";
import type { Comic, Genre } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export const GENRES_QUERY_KEY = ["genres"] as const;
export const COMICS_BY_GENRE_QUERY_KEY = (genreId: string) =>
  ["comics", "genre", genreId] as const;
export const SEARCH_COMICS_QUERY_KEY = (query: string) =>
  ["comics", "search", query] as const;

export function useGenres() {
  return useQuery<Genre[]>({
    queryKey: GENRES_QUERY_KEY,
    queryFn: () => listGenres(),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useComicsByGenre(genreId: string) {
  return useQuery<Comic[]>({
    queryKey: COMICS_BY_GENRE_QUERY_KEY(genreId),
    queryFn: () => getComicsByGenre(genreId),
    enabled: genreId.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useSearchComics(query: string) {
  return useQuery<Comic[]>({
    queryKey: SEARCH_COMICS_QUERY_KEY(query),
    queryFn: () => searchComics(query),
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: true,
  });
}
