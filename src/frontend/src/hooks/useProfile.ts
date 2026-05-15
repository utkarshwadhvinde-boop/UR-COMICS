import { getProfile, updateProfile } from "@/services/profileService";
import type { UserProfile } from "@/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PROFILE_QUERY_KEY = (userId: string) =>
  ["profile", userId] as const;

export function useProfile(userId: string | undefined) {
  return useQuery<UserProfile | null>({
    queryKey: PROFILE_QUERY_KEY(userId ?? ""),
    queryFn: async () => {
      if (!userId) return null;
      return getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfile,
    Error,
    {
      display_name?: string;
      bio?: string;
      avatar_url?: string;
      handle?: string;
    }
  >({
    mutationFn: (updates) => {
      if (!userId) throw new Error("Not authenticated");
      return updateProfile(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
