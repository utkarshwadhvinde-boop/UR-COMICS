import { getTrendingComics } from "@/services/comicsService";
import { getResumeReading } from "@/services/profileService";
import type { Comic } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export const TRENDING_QUERY_KEY = ["trending"] as const;
export const RESUME_READING_QUERY_KEY = ["resumeReading"] as const;

export function useTrending(limit = 20) {
  return useQuery<Comic[]>({
    queryKey: TRENDING_QUERY_KEY,
    queryFn: () => getTrendingComics(limit),
    staleTime: 60 * 60 * 1000,
    refetchOnMount: true,
  });
}

export function useResumeReading(userId?: string) {
  return useQuery<Comic[]>({
    queryKey: [...RESUME_READING_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return [];
      return (await getResumeReading(userId, 3)) ?? [];
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
