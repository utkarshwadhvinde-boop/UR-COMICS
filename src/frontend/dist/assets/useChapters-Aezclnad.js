import { l as listChapters } from "./chaptersService-CdTVL-Cg.js";
import { u as useQuery } from "./index-WeXjJ7Am.js";
function chaptersQueryKey(comicId) {
  return ["chapters", comicId];
}
function useChapters(comicId) {
  return useQuery({
    queryKey: chaptersQueryKey(comicId ?? ""),
    queryFn: async () => {
      if (!comicId) return [];
      return listChapters(comicId);
    },
    enabled: !!comicId,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  chaptersQueryKey as c,
  useChapters as u
};
