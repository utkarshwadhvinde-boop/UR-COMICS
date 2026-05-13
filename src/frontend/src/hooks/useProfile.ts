import { createActor } from "@/backend";
import type { UpdateProfileRequest, UserProfile } from "@/backend";
import { getUserProfile, updateMyProfile } from "@/services/profileService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PROFILE_QUERY_KEY = (userId: string) =>
  ["profile", userId] as const;

export function useProfile(userId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile | null>({
    queryKey: PROFILE_QUERY_KEY(userId),
    queryFn: async () => {
      if (!actor) return null;
      return getUserProfile(actor, userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not available");
      return updateMyProfile(actor, req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
