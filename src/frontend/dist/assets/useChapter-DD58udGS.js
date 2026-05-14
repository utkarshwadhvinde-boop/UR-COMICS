import { i as useActor, n as useQuery, m as createActor } from "./index-yTllSx9S.js";
import { g as getChapter } from "./chaptersService-CLqlZx2h.js";
function chapterQueryKey(comicId, chapterId) {
  return ["chapters", comicId, chapterId];
}
function useChapter(comicId, chapterId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: chapterQueryKey(comicId ?? "", chapterId ?? ""),
    queryFn: async () => {
      if (!actor || !chapterId) return null;
      return getChapter(actor, chapterId);
    },
    enabled: !!actor && !isFetching && !!comicId && !!chapterId,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  chapterQueryKey as c,
  useChapter as u
};
