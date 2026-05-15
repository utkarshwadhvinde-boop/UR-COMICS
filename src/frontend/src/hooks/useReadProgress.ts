import { getReadProgress, saveReadProgress } from "@/services/profileService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const READ_PROGRESS_QUERY_KEY = (comicId: string) =>
  ["readProgress", comicId] as const;

export function useReadProgress(
  userId: string | undefined,
  comicId: string | undefined,
) {
  return useQuery<{
    last_chapter_id: string | null;
    last_page_number: number;
  } | null>({
    queryKey: READ_PROGRESS_QUERY_KEY(comicId ?? ""),
    queryFn: async () => {
      if (!userId || !comicId) return null;
      return getReadProgress(userId, comicId);
    },
    enabled: !!userId && !!comicId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSaveReadProgress(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { comicId: string; lastChapterId: string; lastPageNumber: number }
  >({
    mutationFn: async ({ comicId, lastChapterId, lastPageNumber }) => {
      if (!userId) throw new Error("Not authenticated");
      return saveReadProgress(userId, comicId, lastChapterId, lastPageNumber);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: READ_PROGRESS_QUERY_KEY(variables.comicId),
      });
      queryClient.invalidateQueries({ queryKey: ["resumeReading"] });
    },
  });
}
