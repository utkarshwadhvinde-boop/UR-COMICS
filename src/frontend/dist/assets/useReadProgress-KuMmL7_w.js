import { u as useQuery, n as useQueryClient, s as saveReadProgress } from "./index-WeXjJ7Am.js";
import { u as useMutation } from "./useMutation-CMXDeqR0.js";
const READ_PROGRESS_QUERY_KEY = (comicId) => ["readProgress", comicId];
function useReadProgress(userId, comicId) {
  return useQuery({
    queryKey: READ_PROGRESS_QUERY_KEY(comicId ?? ""),
    queryFn: async () => {
      return null;
    },
    enabled: false,
    staleTime: 2 * 60 * 1e3
  });
}
function useSaveReadProgress(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ comicId, lastChapterId, lastPageNumber }) => {
      if (!userId) throw new Error("Not authenticated");
      return saveReadProgress(userId, comicId, lastChapterId, lastPageNumber);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: READ_PROGRESS_QUERY_KEY(variables.comicId)
      });
      queryClient.invalidateQueries({ queryKey: ["resumeReading"] });
    }
  });
}
export {
  useSaveReadProgress as a,
  useReadProgress as u
};
