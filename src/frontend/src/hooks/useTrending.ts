import { createActor } from "@/backend";
import type { Comic, ReadProgress, TrendingEntry } from "@/backend";
import {
  getMyResumeReading,
  getTrendingComics,
} from "@/services/profileService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export const TRENDING_QUERY_KEY = ["trending"] as const;
export const RESUME_READING_QUERY_KEY = ["resumeReading"] as const;

export function useTrending(limit = 20) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TrendingEntry[]>({
    queryKey: TRENDING_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return getTrendingComics(actor, limit);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 60 * 1000,
    refetchOnMount: true,
  });
}

export function useResumeReading() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<[Comic, ReadProgress]>>({
    queryKey: RESUME_READING_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return getMyResumeReading(actor, 3);
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
