import { getComic } from "@/services/comicsService";
import type { Comic } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export function comicQueryKey(id: string) {
  return ["comics", id] as const;
}

export function useComic(id: string | undefined) {
  return useQuery<Comic | null>({
    queryKey: comicQueryKey(id ?? ""),
    queryFn: async () => {
      if (!id) return null;
      return getComic(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
