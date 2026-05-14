import { i as useActor, n as useQuery, m as createActor } from "./index-yTllSx9S.js";
import { l as listChapters } from "./chaptersService-CLqlZx2h.js";
function chaptersQueryKey(comicId) {
  return ["chapters", comicId];
}
function useChapters(comicId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: chaptersQueryKey(comicId ?? ""),
    queryFn: async () => {
      if (!actor || !comicId) return [];
      return listChapters(actor, comicId);
    },
    enabled: !!actor && !isFetching && !!comicId,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  chaptersQueryKey as c,
  useChapters as u
};
