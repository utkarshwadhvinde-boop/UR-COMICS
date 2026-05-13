import { k as useActor, l as useQuery, n as createActor } from "./index-DBVmmKIh.js";
import { l as listChapters } from "./chaptersService-CSOdR9Lz.js";
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
