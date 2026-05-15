import { listChapters } from "@/services/chaptersService";
import type { Chapter } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export function chaptersQueryKey(comicId: string) {
  return ["chapters", comicId] as const;
}

export function useChapters(comicId: string | undefined) {
  return useQuery<Chapter[]>({
    queryKey: chaptersQueryKey(comicId ?? ""),
    queryFn: async () => {
      if (!comicId) return [];
      return listChapters(comicId);
    },
    enabled: !!comicId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
