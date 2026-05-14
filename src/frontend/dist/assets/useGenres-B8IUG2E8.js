import { i as useActor, n as useQuery, m as createActor } from "./index-yTllSx9S.js";
import { l as listGenres, a as getComicsByGenre, s as searchComics } from "./comicsService-DtcN4hqc.js";
const GENRES_QUERY_KEY = ["genres"];
const COMICS_BY_GENRE_QUERY_KEY = (genreId) => ["comics", "genre", genreId];
const SEARCH_COMICS_QUERY_KEY = (query) => ["comics", "search", query];
const FALLBACK_GENRES = [
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
  { id: "psychological", name: "Psychological", slug: "psychological" }
];
function useGenres() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
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
    staleTime: 24 * 60 * 60 * 1e3,
    // 24 hours
    gcTime: 24 * 60 * 60 * 1e3
  });
}
function useComicsByGenre(genreId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: COMICS_BY_GENRE_QUERY_KEY(genreId),
    queryFn: async () => {
      if (!actor) return [];
      return getComicsByGenre(actor, genreId);
    },
    enabled: !!actor && !isFetching && genreId.length > 0,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
function useSearchComics(query) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: SEARCH_COMICS_QUERY_KEY(query),
    queryFn: async () => {
      if (!actor) return [];
      return searchComics(actor, query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
    staleTime: 2 * 60 * 1e3,
    refetchOnMount: true
  });
}
export {
  FALLBACK_GENRES as F,
  useSearchComics as a,
  useComicsByGenre as b,
  useGenres as u
};
