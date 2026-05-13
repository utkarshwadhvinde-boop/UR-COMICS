import { createActor } from "@/backend";
import type { ReadProgress, SaveReadProgressRequest } from "@/backend";
import {
  getMyReadProgress,
  saveMyReadProgress,
} from "@/services/profileService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const READ_PROGRESS_QUERY_KEY = (comicId: string) =>
  ["readProgress", comicId] as const;

export function useReadProgress(comicId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReadProgress | null>({
    queryKey: READ_PROGRESS_QUERY_KEY(comicId),
    queryFn: async () => {
      if (!actor) return null;
      return getMyReadProgress(actor, comicId);
    },
    enabled: !!actor && !isFetching && !!comicId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSaveReadProgress() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveReadProgressRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not available");
      return saveMyReadProgress(actor, req);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: READ_PROGRESS_QUERY_KEY(variables.comic_id),
      });
      queryClient.invalidateQueries({ queryKey: ["resumeReading"] });
    },
  });
}
