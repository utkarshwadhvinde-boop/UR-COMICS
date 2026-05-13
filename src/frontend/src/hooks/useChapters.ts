import { createActor } from "@/backend";
import type { ChapterView } from "@/backend";
import { listChapters } from "@/services/chaptersService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function chaptersQueryKey(comicId: string) {
  return ["chapters", comicId] as const;
}

export function useChapters(comicId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChapterView[]>({
    queryKey: chaptersQueryKey(comicId ?? ""),
    queryFn: async () => {
      if (!actor || !comicId) return [];
      return listChapters(actor, comicId);
    },
    enabled: !!actor && !isFetching && !!comicId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
