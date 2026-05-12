import { createActor } from "@/backend";
import type {
  ComicPublic,
  NotificationPublic,
  UserProfilePublic,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Exporting types so other components can use them
export type { NotificationPublic, UserProfilePublic, ComicPublic };

/**
 * SHARED LOGIC: Centralized Actor Readiness
 * Bypassing 'isFetching' prevents the UI from locking up during background refreshes.
 */
const useBackendActor = () => {
  const { actor, isFetching, error } = useActor(createActor);
  const isReady = !!actor && !error;
  return { actor, isReady, isFetching, error };
};

// ─── Profiles ──────────────────────────────────────────────────────────────

export function useCreateOrUpdateProfile() {
  const { actor, isReady } = useBackendActor();
  const qc = useQueryClient();

  return useMutation<
    UserProfilePublic,
    Error,
    { userId: string; username: string; avatarUrl?: string; bio?: string }
  >({
    mutationFn: async ({ userId, username, avatarUrl, bio }) => {
      if (!actor) throw new Error("Blockchain connection lost. Please refresh.");
      return actor.createOrUpdateProfile(
        userId,
        username,
        avatarUrl ?? null,
        bio ?? null,
      );
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["backend", "profile", vars.userId] });
      qc.invalidateQueries({ queryKey: ["backend", "creatorProfiles"] });
    },
  });
}

export function useGetProfile(userId: string | null) {
  const { actor } = useBackendActor();
  
  return useQuery<UserProfilePublic | null>({
    queryKey: ["backend", "profile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getProfile(userId);
    },
    enabled: !!actor && !!userId, 
    staleTime: 30_000,
  });
}

// ─── Follow System ─────────────────────────────────────────────────────────

export function useFollowUser() {
  const { actor, isReady } = useBackendActor();
  const qc = useQueryClient();

  return useMutation<boolean, Error, { followerId: string; followeeId: string }>({
    mutationFn: async ({ followerId, followeeId }) => {
      if (!actor) throw new Error("Backend not ready.");
      return actor.followUser(followerId, followeeId);
    },
    onSuccess: (_, vars) => {
      // Specifically invalidate follower/following counts and profile status
      qc.invalidateQueries({ queryKey: ["backend", "profile", vars.followeeId] });
      qc.invalidateQueries({ queryKey: ["backend", "profile", vars.followerId] });
    },
  });
}

// ─── Notifications ─────────────────────────────────────────────────────────

export function useGetUnreadCount(userId: string | null) {
  const { actor } = useBackendActor();
  
  return useQuery<bigint>({
    queryKey: ["backend", "unreadCount", userId],
    queryFn: async () => {
      if (!actor || !userId) return BigInt(0);
      return actor.getUnreadCount(userId);
    },
    enabled: !!actor && !!userId,
    refetchInterval: 30_000, // Check every 30s for new alerts
  });
}

export function useGetNotifications(userId: string | null) {
  const { actor } = useBackendActor();
  
  return useQuery<NotificationPublic[]>({
    queryKey: ["backend", "notifications", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getNotifications(userId);
    },
    enabled: !!actor && !!userId,
  });
}

export function useMarkAllRead() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Blockchain unreachable.");
      return actor.markAllNotificationsRead(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["backend", "unreadCount", userId] });
      qc.invalidateQueries({ queryKey: ["backend", "notifications", userId] });
    },
  });
}
