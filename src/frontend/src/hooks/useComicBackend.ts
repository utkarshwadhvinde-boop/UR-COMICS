import {
  ChapterError,
  type ChapterInput,
  type ChapterPublic,
  ChapterStatus,
  type ComicInput,
  type ComicPublic,
  type ReadingProgress,
  type Result,
  createActor,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export { ChapterStatus, ChapterError };
export type { ChapterPublic, ComicPublic, Result };

/** Unwrap a Result<Bool, ChapterError> — throws with a human message on #err */
function unwrapResult(result: Result, context: string): boolean {
  if (result.__kind__ === "ok") return result.ok;
  const reason =
    result.err === ChapterError.notFound
      ? "Chapter not found"
      : result.err === ChapterError.unauthorized
        ? "You don't have permission to do that"
        : "Unknown error";
  throw new Error(`${context}: ${reason}`);
}

export function useListComics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ComicPublic[]>({
    queryKey: ["comics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListChapters(
  comicId: bigint | null,
  publishedOnly: boolean,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChapterPublic[]>({
    queryKey: ["chapters", comicId?.toString(), publishedOnly],
    queryFn: async () => {
      if (!actor || comicId === null) return [];
      return actor.listChapters(comicId, publishedOnly);
    },
    enabled: !!actor && !isFetching && comicId !== null,
  });
}

export function useCreateComic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<bigint, Error, ComicInput>({
    mutationFn: async (input) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      return actor.createComic(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] }),
  });
}

export function useUpdateComic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: bigint; input: ComicInput }>({
    mutationFn: async ({ id, input }) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      return actor.updateComic(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] }),
  });
}

export function useDeleteComic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.deleteComic(id);
      return unwrapResult(result, "deleteComic");
    },
    onSuccess: (_, id) => {
      const idStr = id.toString();

      // Optimistically remove from ALL comics caches so card disappears instantly
      qc.setQueryData<ComicPublic[]>(["backend", "comics"], (prev) =>
        prev ? prev.filter((c) => c.id.toString() !== idStr) : prev,
      );
      qc.setQueryData<ComicPublic[]>(["comics"], (prev) =>
        prev ? prev.filter((c) => c.id.toString() !== idStr) : prev,
      );
      // Remove from ALL trending cache entries (any limit)
      qc.setQueriesData<ComicPublic[]>(
        { queryKey: ["backend", "trending"] },
        (prev) => (prev ? prev.filter((c) => c.id.toString() !== idStr) : prev),
      );

      // Clear chapters for the deleted comic
      qc.removeQueries({ queryKey: ["chapters", idStr] });

      // Clean up localStorage continue-reading references
      try {
        const CR_KEY = "ur_reading_progress";
        const raw = localStorage.getItem(CR_KEY);
        if (raw) {
          const entries = JSON.parse(raw);
          if (Array.isArray(entries)) {
            const cleaned = entries.filter(
              (e: { comicId?: string }) => e.comicId !== idStr,
            );
            localStorage.setItem(CR_KEY, JSON.stringify(cleaned));
          }
        }
      } catch {
        // ignore localStorage errors
      }

      // Full refetch to confirm server state
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    },
  });
}

export function useCreateChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<bigint, Error, ChapterInput>({
    mutationFn: async (input) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      return actor.createChapter(input);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["chapters", vars.comicId.toString()] }),
  });
}

export function useUpdateChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: bigint; input: ChapterInput }>({
    mutationFn: async ({ id, input }) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.updateChapter(id, input);
      return unwrapResult(result, "updateChapter");
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["chapters", vars.input.comicId.toString()],
      }),
  });
}

export function useUpdateChapterOrder() {
  const { actor } = useActor(createActor);
  return useMutation<boolean, Error, { id: bigint; newImageOrder: bigint[] }>({
    mutationFn: async ({ id, newImageOrder }) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.updateChapterOrder(id, newImageOrder);
      return unwrapResult(result, "updateChapterOrder");
    },
  });
}

export function usePublishChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.publishChapter(id);
      return unwrapResult(result, "publishChapter");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
  });
}

export function useUnpublishChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.unpublishChapter(id);
      return unwrapResult(result, "unpublishChapter");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
  });
}

export function useDeleteChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: bigint; comicId?: bigint }>({
    mutationFn: async ({ id }) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      const result = await actor.deleteChapter(id);
      return unwrapResult(result, "deleteChapter");
    },
    onSuccess: (_, vars) => {
      const idStr = vars.id.toString();
      const comicIdStr = vars.comicId?.toString();

      // Optimistically remove chapter from all chapter list caches
      qc.setQueriesData<ChapterPublic[]>({ queryKey: ["chapters"] }, (prev) =>
        prev ? prev.filter((ch) => ch.id.toString() !== idStr) : prev,
      );

      // Also clean up localStorage reading-progress for this chapter
      try {
        const CR_KEY = "ur_reading_progress";
        const raw = localStorage.getItem(CR_KEY);
        if (raw) {
          const entries = JSON.parse(raw);
          if (Array.isArray(entries)) {
            const cleaned = entries.filter(
              (e: { chapterId?: string }) => e.chapterId !== idStr,
            );
            localStorage.setItem(CR_KEY, JSON.stringify(cleaned));
          }
        }
      } catch {
        // ignore
      }

      // Full refetch to confirm server state
      if (comicIdStr) {
        qc.invalidateQueries({ queryKey: ["chapters", comicIdStr, true] });
        qc.invalidateQueries({ queryKey: ["chapters", comicIdStr, false] });
      } else {
        qc.invalidateQueries({ queryKey: ["chapters"] });
      }
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    },
  });
}

export function useUpdateReadingProgress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { comicId: bigint; chapterId: bigint; userId: string }
  >({
    mutationFn: async ({ comicId, chapterId, userId }) => {
      if (!actor) {
  console.warn("Actor not ready yet, retrying...");
  throw new Error("System is still initializing. Please wait 2–3 seconds and try again.");
}
      return actor.updateReadingProgress(comicId, chapterId, userId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["backend", "progress", vars.userId] });
    },
  });
}

export function useGetReadingProgress(
  comicId: bigint | null,
  userId: string | null,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReadingProgress | null>({
    queryKey: ["readingProgress", comicId?.toString(), userId],
    queryFn: async () => {
      if (!actor || comicId === null || !userId) return null;
      return actor.getReadingProgress(comicId, userId);
    },
    enabled: !!actor && !isFetching && comicId !== null && !!userId,
    staleTime: 30_000,
  });
}

export type { ReadingProgress };
