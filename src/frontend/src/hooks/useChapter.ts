import { getChapterWithPages } from "@/services/chaptersService";
import type { Chapter } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export function chapterQueryKey(comicId: string, chapterId: string) {
  return ["chapters", comicId, chapterId] as const;
}

export function useChapter(
  comicId: string | undefined,
  chapterId: string | undefined,
) {
  return useQuery<Chapter | null>({
    queryKey: chapterQueryKey(comicId ?? "", chapterId ?? ""),
    queryFn: async () => {
      if (!chapterId) return null;
      return getChapterWithPages(chapterId);
    },
    enabled: !!comicId && !!chapterId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
