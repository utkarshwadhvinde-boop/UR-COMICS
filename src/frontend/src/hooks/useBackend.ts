import { createActor } from "@/backend";
import type {
  ComicPublic,
  NotificationPublic,
  UserProfilePublic,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type { NotificationPublic, UserProfilePublic, ComicPublic };

// ─── Comics ────────────────────────────────────────────────────────────────

export function useListComicsQuery() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicPublic[]>({
    queryKey: ["backend", "comics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetTrending(limit = 10) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicPublic[]>({
    queryKey: ["backend", "trending", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrending(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Profiles ──────────────────────────────────────────────────────────────

export function useGetProfile(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfilePublic | null>({
    queryKey: ["backend", "profile", userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30_000,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<
    UserProfilePublic,
    Error,
    { userId: string; username: string; avatarUrl?: string; bio?: string }
  >({
    mutationFn: async ({ userId, username, avatarUrl, bio }) => {
      if (!actor) throw new Error("Actor not ready");
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
  return { ...mutation, isActorReady };
}

export function useListCreatorProfiles(limit = 50) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfilePublic[]>({
    queryKey: ["backend", "creatorProfiles", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCreatorProfiles(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Follow system ─────────────────────────────────────────────────────────

export function useIsFollowing(
  followerId: string | null,
  followeeId: string | null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["backend", "isFollowing", followerId, followeeId],
    queryFn: async () => {
      if (!actor || !followerId || !followeeId) return false;
      return actor.isFollowing(followerId, followeeId);
    },
    enabled: !!actor && !isFetching && !!followerId && !!followeeId,
  });
}

export function useGetFollowers(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string[]>({
    queryKey: ["backend", "followers", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getFollowers(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useGetFollowing(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string[]>({
    queryKey: ["backend", "following", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getFollowing(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useFollowUser() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<
    boolean,
    Error,
    { followerId: string; followeeId: string }
  >({
    mutationFn: async ({ followerId, followeeId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.followUser(followerId, followeeId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["backend", "isFollowing", vars.followerId, vars.followeeId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "followers", vars.followeeId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "following", vars.followerId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "profile", vars.followeeId],
      });
    },
  });
  return { ...mutation, isActorReady };
}

export function useUnfollowUser() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<
    boolean,
    Error,
    { followerId: string; followeeId: string }
  >({
    mutationFn: async ({ followerId, followeeId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.unfollowUser(followerId, followeeId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["backend", "isFollowing", vars.followerId, vars.followeeId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "followers", vars.followeeId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "following", vars.followerId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "profile", vars.followeeId],
      });
    },
  });
  return { ...mutation, isActorReady };
}

// ─── Notifications ─────────────────────────────────────────────────────────

export function useGetNotifications(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<NotificationPublic[]>({
    queryKey: ["backend", "notifications", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getNotifications(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useGetUnreadCount(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<bigint>({
    queryKey: ["backend", "unreadCount", userId],
    queryFn: async () => {
      if (!actor || !userId) return BigInt(0);
      return actor.getUnreadCount(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 30_000,
  });
}

export function useMarkNotifRead() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<
    boolean,
    Error,
    { userId: string; notifId: bigint }
  >({
    mutationFn: async ({ userId, notifId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markRead(userId, notifId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["backend", "notifications", vars.userId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "unreadCount", vars.userId],
      });
    },
  });
  return { ...mutation, isActorReady };
}

export function useMarkAllRead() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markAllRead(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({
        queryKey: ["backend", "notifications", userId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "unreadCount", userId],
      });
    },
  });
  return { ...mutation, isActorReady };
}

export function useClearNotifications() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.clearNotifications(userId);
    },
    onSuccess: (_, userId) => {
      qc.invalidateQueries({
        queryKey: ["backend", "notifications", userId],
      });
      qc.invalidateQueries({
        queryKey: ["backend", "unreadCount", userId],
      });
    },
  });
  return { ...mutation, isActorReady };
}

// ─── Reading Progress ──────────────────────────────────────────────────────

export function useListProgress(userId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["backend", "progress", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.listProgress(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}
