import { createActor } from "@/backend";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ComicInput,
  ChapterInput,
  ChapterPublic,
} from "@/backend";

/* ─────────────────────────────────────────────
   ACTOR SETUP
───────────────────────────────────────────── */
const useBackendStatus = () => {
  const actor = createActor();

  return {
    actor,
    isReady: !!actor,
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
      return actor.createComic(input);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });

  return { ...mutation, isActorReady: isReady };
};

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

      return actor.updateChapter(id, input);
    },

    onSuccess: (_, vars) => {
      const comicId = vars.input.comicId.toString();

      qc.invalidateQueries({ queryKey: ["chapters", comicId] });
      qc.invalidateQueries({ queryKey: ["comic", comicId] });
    },
  });

  return { ...mutation, isActorReady: isReady };
};

/* ─────────────────────────────────────────────
   PUBLISH CHAPTER
───────────────────────────────────────────── */
export function usePublishChapter() {
  const { actor, isReady } = useBackendStatus();
  const qc = useQueryClient();

  const mutation = useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not ready");

      return actor.publishChapter(id);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
    },
  });

  return { ...mutation, isActorReady: isReady };
};

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
};
