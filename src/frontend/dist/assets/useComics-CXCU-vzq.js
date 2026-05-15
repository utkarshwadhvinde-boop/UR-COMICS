import { u as useQuery, J as listComics } from "./index-WeXjJ7Am.js";
const COMICS_QUERY_KEY = ["comics"];
function useComics() {
  return useQuery({
    queryKey: COMICS_QUERY_KEY,
    queryFn: () => listComics(20),
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
export {
  COMICS_QUERY_KEY as C,
  useComics as u
};
