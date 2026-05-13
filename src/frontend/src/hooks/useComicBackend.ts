import { createActor } from "@/backend";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const guardedCall = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn();
  } catch (e) {
    throw e;
  }
};

const unwrapResult = <T,>(result: T, _name: string): T => {
  return result;
};

/**
 * SIMPLE Actor setup (FIXED)
 * No external hook, no missing files
 */
const useBackendStatus = () => {
  const actor = createActor();

  return {
    actor,
    isReady: !!actor,
    isFetching: false,
  };
};

/* ─────────────────────────────────────────────
   CREATE COMIC
───────────────────────────────────────────── */
export function useCreateComic() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();

  const mutation = useMutation<bigint, Error, ComicInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend not ready");

      return guardedCall(() => actor.createComic(input));
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });

  return { ...mutation, isActorReady: isReady };
}

/* ─────────────────────────────────────────────
   UPDATE CHAPTER
───────────────────────────────────────────── */
export function useUpdateChapter() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();

  const mutation = useMutation<
    boolean,
    Error,
    { id: bigint; input: ChapterInput }
  >({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Backend not ready");

      const result = await guardedCall(() =>
        actor.updateChapter(id, input)
      );

      return unwrapResult(result, "updateChapter");
    },

    onSuccess: (_, vars) => {
      const comicId = vars.input.comicId.toString();

      qc.invalidateQueries({ queryKey: ["chapters", comicId] });
      qc.invalidateQueries({ queryKey: ["comic", comicId] });
    },
  });

  return { ...mutation, isActorReady: isReady };
}

/* ─────────────────────────────────────────────
   PUBLISH CHAPTER
───────────────────────────────────────────── */
export function usePublishChapter() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();

  const mutation = useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not ready");

      const result = await guardedCall(() =>
        actor.publishChapter(id)
      );

      return unwrapResult(result, "publishChapter");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });

  return { ...mutation, isActorReady: isReady };
}

/* ─────────────────────────────────────────────
   LIST CHAPTERS
───────────────────────────────────────────── */
export function useListChapters(
  comicId: bigint | null,
  publishedOnly: boolean
) {
  const { actor } = useBackendStatus();

  return useQuery<ChapterPublic[]>({
    queryKey: ["chapters", comicId?.toString(), publishedOnly],

    queryFn: async () => {
      if (!actor || comicId === null) return [];
      return actor.listChapters(comicId, publishedOnly);
    },

    enabled: !!actor && comicId !== null,
    staleTime: 10_000,
  });
    }
