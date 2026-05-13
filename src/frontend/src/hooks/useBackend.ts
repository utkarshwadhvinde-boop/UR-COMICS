import { createActor } from "@/backend";
import type {
  ComicPublic,
  NotificationPublic,
  UserProfilePublic,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { NotificationPublic, UserProfilePublic, ComicPublic };

// ------------------------------
// Actor helper
// ------------------------------
const useBackendActor = () => {
  const { actor, isFetching, error } = useActor(createActor);
  return {
    actor,
    isReady: !!actor && !error,
    isFetching,
    error,
  };
};

// ------------------------------
// COMICS (MISSING IN YOUR CODE — FIXED)
// ------------------------------
export function useListComicsQuery() {
  const { actor, isReady, isFetching } = useBackendActor();

  return useQuery<ComicPublic[]>({
    queryKey: ["backend", "comics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComics();
    },
    enabled: isReady && !isFetching,
  });
}

// ------------------------------
// TRENDING (MISSING — FIXED)
// ------------------------------
export function useGetTrending(limit: number = 5) {
  const { actor, isReady, isFetching } = useBackendActor();

  return useQuery<ComicPublic[]>({
    queryKey: ["backend", "trending", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrending(limit);
    },
    enabled: isReady && !isFetching,
  });
}
