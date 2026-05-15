import { listComics } from "@/services/comicsService";
import type { Comic } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export const COMICS_QUERY_KEY = ["comics"] as const;

export function useComics() {
  return useQuery<Comic[]>({
    queryKey: COMICS_QUERY_KEY,
    queryFn: () => listComics(20),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
