import { createActor } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

  return {
    actor,
    isReady: !!actor,
    isFetching: false,
  };
};

// ... (Keep existing imports and isStoppedCanisterError / guardedCall / unwrapResult)

/** 
 * HELPER: Unified Actor readiness logic 
 * This ensures the UI doesn't hang just because the actor is refreshing in the background.
 */

  // OR your existing hook
  // An actor is ready if it exists. We don't care if it's "fetching" a refresh.
  return { actor, isReady: !!actor && !error, isFetching };
};

export function useCreateComic() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();
  const mutation = useMutation<bigint, Error, ComicInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Blockchain connection lost. Please refresh.");
      return guardedCall(() => actor.createComic(input));
    },
    onSuccess: () => {
      // Fix: Invalidate BOTH common namespaces to prevent stale UI
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });
  return { ...mutation, isActorReady: isReady };
}

export function useUpdateChapter() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();
  const mutation = useMutation<
    boolean,
    Error,
    { id: bigint; input: ChapterInput }
  >({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Backend not ready.");
      const result = await guardedCall(() => actor.updateChapter(id, input));
      return unwrapResult(result, "updateChapter");
    },
    onSuccess: (_, vars) => {
      const comicIdStr = vars.input.comicId.toString();
      // Stability: Ensure all chapter-related views are refreshed
      qc.invalidateQueries({ queryKey: ["chapters", comicIdStr] });
      qc.invalidateQueries({ queryKey: ["comic", comicIdStr] });
    },
  });
  return { ...mutation, isActorReady: isReady };
}

export function usePublishChapter() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();
  const mutation = useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend connection is waking up... try again in a second.");
      const result = await guardedCall(() => actor.publishChapter(id));
      return unwrapResult(result, "publishChapter");
    },
    onSuccess: (_, id) => {
      // Refresh everything to ensure the "Published" badge appears instantly
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });
  return { ...mutation, isActorReady: isReady };
}

// ─── Query Hooks (Fixing the Preview Load) ────────────────────────────────

export function useListChapters(
  comicId: bigint | null,
  publishedOnly: boolean,
) {
  const { actor } = useBackendStatus();
  return useQuery<ChapterPublic[]>({
    queryKey: ["chapters", comicId?.toString(), publishedOnly],
    queryFn: async () => {
      if (!actor || comicId === null) return [];
      return actor.listChapters(comicId, publishedOnly);
    },
    // Fix: Remove !isFetching here so data loads even while actor updates
    enabled: !!actor && comicId !== null,
    staleTime: 10_000, 
  });
}
