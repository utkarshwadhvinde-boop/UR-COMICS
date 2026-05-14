import { i as useActor, n as useQuery, m as createActor } from "./index-yTllSx9S.js";
import { b as listComics } from "./comicsService-DtcN4hqc.js";
const COMICS_QUERY_KEY = ["comics"];
function useComics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: COMICS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return listComics(actor);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  COMICS_QUERY_KEY as C,
  useComics as u
};
