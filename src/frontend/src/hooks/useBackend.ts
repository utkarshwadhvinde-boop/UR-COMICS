import { createActor } from "@/backend";
import type {
  ComicPublic,
  NotificationPublic,
  UserProfilePublic,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { NotificationPublic, UserProfilePublic, ComicPublic };

/**
 * SHARED LOGIC: Centralized Actor Readiness
 * This ensures all hooks use the same definition of 'Connected'
 */
const useBackendActor = () => {
  const { actor, isFetching, error } = useActor(createActor);
  
  // We consider the actor ready if it exists, even if a background refetch is happening.
  // This prevents UI 'flicker' or hangs during background syncing.
  const isReady = !!actor && !error;
  
  return { actor, isReady, isFetching, error };
};

// ─── Profiles ──────────────────────────────────────────────────────────────

export function useCreateOrUpdateProfile() {
  const { actor, isReady } = useBackendActor();
  const qc = useQueryClient();

  const mutation = useMutation<
    UserProfilePublic,
    Error,
    { userId: string; username: string; avatarUrl?: string; bio?: string }
  >({
    mutationFn: async ({ userId, username, avatarUrl, bio }) => {
      if (!actor) throw new Error("Backend connection not established. Please refresh.");
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

  return { ...mutation, isActorReady: isReady };
}

export function useGetProfile(userId: string | null) {
  const { actor, isReady, isFetching } = useBackendActor();
  
  return useQuery<UserProfilePublic | null>({
    queryKey: ["backend", "profile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        return await actor.getProfile(userId);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        throw err;
      }
    },
    // Fix: Only disable if we don't have an actor at all. 
    // If it's just 'fetching' a refresh, let the query proceed or use cache.
    enabled: !!actor && !!userId, 
    staleTime: 30_000,
    retry: 2, // Automatic retry for flaky connections
  });
}

// ─── Follow System (Optimized) ─────────────────────────────────────────────

export function useFollowUser() {
  const { actor, isReady } = useBackendActor();
  const qc = useQueryClient();

  const mutation = useMutation<
    boolean,
    Error,
    { followerId: string; followeeId: string }
  >({
    mutationFn: async ({ followerId, followeeId }) => {
      if (!actor) throw new Error("Connection lost. Try again.");
      return actor.followUser(followerId, followeeId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["backend"] }); // Invalidate all backend cache for consistency
    },
  });

  return { ...mutation, isActorReady: isReady };
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
    refetchInterval: 60_000, // Reduced frequency to save bandwidth
  });
}

// ... (Other functions follow same logic: check !!actor instead of !isFetching)
