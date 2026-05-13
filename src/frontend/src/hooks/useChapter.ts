import { createActor } from "@/backend";
import type { ChapterView } from "@/backend";
import { getChapter } from "@/services/chaptersService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function chapterQueryKey(comicId: string, chapterId: string) {
  return ["chapters", comicId, chapterId] as const;
}

export function useChapter(
  comicId: string | undefined,
  chapterId: string | undefined,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChapterView | null>({
    queryKey: chapterQueryKey(comicId ?? "", chapterId ?? ""),
    queryFn: async () => {
      if (!actor || !chapterId) return null;
      return getChapter(actor, chapterId);
    },
    enabled: !!actor && !isFetching && !!comicId && !!chapterId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
