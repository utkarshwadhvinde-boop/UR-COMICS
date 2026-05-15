import { u as useQuery, F as getComic } from "./index-WeXjJ7Am.js";
function comicQueryKey(id) {
  return ["comics", id];
}
function useComic(id) {
  return useQuery({
    queryKey: comicQueryKey(id ?? ""),
    queryFn: async () => {
      if (!id) return null;
      return getComic(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  useComic as u
};
