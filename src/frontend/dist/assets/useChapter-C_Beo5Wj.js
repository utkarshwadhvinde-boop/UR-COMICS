import { k as useActor, l as useQuery, n as createActor } from "./index-DBVmmKIh.js";
import { g as getChapter } from "./chaptersService-CSOdR9Lz.js";
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
