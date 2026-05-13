import { createActor } from "@/backend";
import type { ComicView } from "@/backend";
import { listComics } from "@/services/comicsService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export const COMICS_QUERY_KEY = ["comics"] as const;

export function useComics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicView[]>({
    queryKey: COMICS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return listComics(actor);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
