import { u as useQuery, n as useQueryClient, N as updateProfile, O as getProfile } from "./index-WeXjJ7Am.js";
import { u as useMutation } from "./useMutation-CMXDeqR0.js";
const PROFILE_QUERY_KEY = (userId) => ["profile", userId];
function useProfile(userId) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId ?? ""),
    queryFn: async () => {
      if (!userId) return null;
      return getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1e3
  });
}
function useUpdateProfile(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates) => {
      if (!userId) throw new Error("Not authenticated");
      return updateProfile(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}
export {
  useUpdateProfile as a,
  useProfile as u
};
