import { g as getChapterWithPages } from "./chaptersService-CdTVL-Cg.js";
import { u as useQuery } from "./index-WeXjJ7Am.js";
function chapterQueryKey(comicId, chapterId) {
  return ["chapters", comicId, chapterId];
}
function useChapter(comicId, chapterId) {
  return useQuery({
    queryKey: chapterQueryKey(comicId ?? "", chapterId ?? ""),
    queryFn: async () => {
      if (!chapterId) return null;
      return getChapterWithPages(chapterId);
    },
    enabled: !!comicId && !!chapterId,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  useChapter as u
};
