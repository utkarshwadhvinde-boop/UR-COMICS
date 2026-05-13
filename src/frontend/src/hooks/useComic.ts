import { createActor } from "@/backend";
import type { ComicView } from "@/backend";
import { getComic } from "@/services/comicsService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function comicQueryKey(id: string) {
  return ["comics", id] as const;
}

export function useComic(id: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicView | null>({
    queryKey: comicQueryKey(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return getComic(actor, id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
