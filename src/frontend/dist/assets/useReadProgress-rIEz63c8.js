import { k as useActor, l as useQuery, m as useQueryClient, s as saveMyReadProgress, n as createActor, o as getMyReadProgress } from "./index-DBVmmKIh.js";
import { u as useMutation } from "./useMutation-CJ4xUsLW.js";
const READ_PROGRESS_QUERY_KEY = (comicId) => ["readProgress", comicId];
function useReadProgress(comicId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: READ_PROGRESS_QUERY_KEY(comicId),
    queryFn: async () => {
      if (!actor) return null;
      return getMyReadProgress(actor, comicId);
    },
    enabled: !!actor && !isFetching && !!comicId,
    staleTime: 2 * 60 * 1e3
  });
}
function useSaveReadProgress() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not available");
      return saveMyReadProgress(actor, req);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: READ_PROGRESS_QUERY_KEY(variables.comic_id)
      });
      queryClient.invalidateQueries({ queryKey: ["resumeReading"] });
    }
  });
}
export {
  useSaveReadProgress as a,
  useReadProgress as u
};
