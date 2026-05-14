import { i as useActor, n as useQuery, o as useQueryClient, G as updateMyProfile, m as createActor, H as getUserProfile } from "./index-yTllSx9S.js";
import { u as useMutation } from "./useMutation-tUJOmKg9.js";
const PROFILE_QUERY_KEY = (userId) => ["profile", userId];
function useProfile(userId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: PROFILE_QUERY_KEY(userId),
    queryFn: async () => {
      if (!actor) return null;
      return getUserProfile(actor, userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 5 * 60 * 1e3
  });
}
function useUpdateProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not available");
      return updateMyProfile(actor, req);
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
