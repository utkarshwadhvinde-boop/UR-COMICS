import { k as useActor, l as useQuery, n as createActor } from "./index-DBVmmKIh.js";
import { g as getComic } from "./comicsService-BozSeBsV.js";
function comicQueryKey(id) {
  return ["comics", id];
}
function useComic(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: comicQueryKey(id ?? ""),
    queryFn: async () => {
      if (!actor || !id) return null;
      return getComic(actor, id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  comicQueryKey as c,
  useComic as u
};
