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
// COMICS
// ------------------------------
export function useListComics() {
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
// TRENDING
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

// ------------------------------
// NOTIFICATIONS (MISSING — FIX)
// ------------------------------
export function useGetNotifications(userId: string | null) {
  const { actor, isReady } = useBackendActor();

  return useQuery<NotificationPublic[]>({
    queryKey: ["backend", "notifications", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getNotifications(userId);
    },
    enabled: isReady && !!userId,
  });
}

export function useGetUnreadCount(userId: string | null) {
  const { actor, isReady } = useBackendActor();

  return useQuery<bigint>({
    queryKey: ["backend", "unreadCount", userId],
    queryFn: async () => {
      if (!actor || !userId) return BigInt(0);
      return actor.getUnreadCount(userId);
    },
    enabled: isReady && !!userId,
    refetchInterval: 30000,
  });
}

export function useMarkAllRead() {
  const { actor, isReady } = useBackendActor();
  const qc = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.markAllNotificationsRead(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["backend", "notifications", userId] });
      qc.invalidateQueries({ queryKey: ["backend", "unreadCount", userId] });
    },
  });
}
