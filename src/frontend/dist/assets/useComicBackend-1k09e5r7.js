import { y as useActor, z as useQuery, b as useQueryClient, A as useMutation, D as ChapterError, m as createActor } from "./index-BU3WKumI.js";
function isStoppedCanisterError(err) {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("is stopped") || msg.includes("IC0508") || msg.includes("reject_code") && msg.includes("5") && msg.includes("stopped");
}
async function guardedCall(fn) {
  try {
    return await fn();
  } catch (err) {
    if (isStoppedCanisterError(err)) {
      throw new Error(
        "Service temporarily unavailable — please try again in a moment."
      );
    }
    throw err;
  }
}
function unwrapResult(result, context) {
  if (result.__kind__ === "ok") return result.ok;
  const reason = result.err === ChapterError.notFound ? "Chapter not found" : result.err === ChapterError.unauthorized ? "You don't have permission to do that" : "Unknown error";
  throw new Error(`${context}: ${reason}`);
}
function useListComics() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["comics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComics();
    },
    enabled: !!actor && !isFetching
  });
}
function useListChapters(comicId, publishedOnly) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["chapters", comicId == null ? void 0 : comicId.toString(), publishedOnly],
    queryFn: async () => {
      if (!actor || comicId === null) return [];
      return actor.listChapters(comicId, publishedOnly);
    },
    enabled: !!actor && !isFetching && comicId !== null
  });
}
function useCreateComic() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return guardedCall(() => actor.createComic(input));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] })
  });
  return { ...mutation, isActorReady };
}
function useUpdateComic() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return guardedCall(() => actor.updateComic(id, input));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] })
  });
  return { ...mutation, isActorReady };
}
function useDeleteComic() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id) => {
      if (!actor)
        throw new Error("Backend not ready, please wait and try again.");
      const result = await guardedCall(() => actor.deleteComic(id));
      return unwrapResult(result, "deleteComic");
    },
    onSuccess: (_, id) => {
      const idStr = id.toString();
      qc.setQueryData(
        ["backend", "comics"],
        (prev) => prev ? prev.filter((c) => c.id.toString() !== idStr) : prev
      );
      qc.setQueryData(
        ["comics"],
        (prev) => prev ? prev.filter((c) => c.id.toString() !== idStr) : prev
      );
      qc.setQueriesData(
        { queryKey: ["backend", "trending"] },
        (prev) => prev ? prev.filter((c) => c.id.toString() !== idStr) : prev
      );
      qc.removeQueries({ queryKey: ["chapters", idStr] });
      try {
        const CR_KEY = "ur_reading_progress";
        const raw = localStorage.getItem(CR_KEY);
        if (raw) {
          const entries = JSON.parse(raw);
          if (Array.isArray(entries)) {
            const cleaned = entries.filter(
              (e) => e.comicId !== idStr
            );
            localStorage.setItem(CR_KEY, JSON.stringify(cleaned));
          }
        }
      } catch {
      }
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    }
  });
  return { ...mutation, isActorReady };
}
function useCreateChapter() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return guardedCall(() => actor.createChapter(input));
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["chapters", vars.comicId.toString()] })
  });
  return { ...mutation, isActorReady };
}
function useUpdateChapter() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor)
        throw new Error("Backend not ready, please wait and try again.");
      const result = await guardedCall(() => actor.updateChapter(id, input));
      return unwrapResult(result, "updateChapter");
    },
    onSuccess: (_, vars) => {
      const comicIdStr = vars.input.comicId.toString();
      qc.invalidateQueries({ queryKey: ["chapters", comicIdStr] });
      qc.invalidateQueries({ queryKey: ["comic", comicIdStr] });
    }
  });
  return { ...mutation, isActorReady };
}
function usePublishChapter() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id) => {
      if (!actor)
        throw new Error("Backend not ready, please wait and try again.");
      const result = await guardedCall(() => actor.publishChapter(id));
      return unwrapResult(result, "publishChapter");
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["comic", id.toString()] });
    }
  });
  return { ...mutation, isActorReady };
}
function useUnpublishChapter() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id) => {
      if (!actor)
        throw new Error("Backend not ready, please wait and try again.");
      const result = await guardedCall(() => actor.unpublishChapter(id));
      return unwrapResult(result, "unpublishChapter");
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["comic", id.toString()] });
    }
  });
  return { ...mutation, isActorReady };
}
function useDeleteChapter() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id }) => {
      if (!actor)
        throw new Error("Backend not ready, please wait and try again.");
      const result = await guardedCall(() => actor.deleteChapter(id));
      return unwrapResult(result, "deleteChapter");
    },
    onSuccess: (_, vars) => {
      var _a;
      const idStr = vars.id.toString();
      const comicIdStr = (_a = vars.comicId) == null ? void 0 : _a.toString();
      qc.setQueriesData(
        { queryKey: ["chapters"] },
        (prev) => prev ? prev.filter((ch) => ch.id.toString() !== idStr) : prev
      );
      try {
        const CR_KEY = "ur_reading_progress";
        const raw = localStorage.getItem(CR_KEY);
        if (raw) {
          const entries = JSON.parse(raw);
          if (Array.isArray(entries)) {
            const cleaned = entries.filter(
              (e) => e.chapterId !== idStr
            );
            localStorage.setItem(CR_KEY, JSON.stringify(cleaned));
          }
        }
      } catch {
      }
      if (comicIdStr) {
        qc.invalidateQueries({ queryKey: ["chapters", comicIdStr, true] });
        qc.invalidateQueries({ queryKey: ["chapters", comicIdStr, false] });
        qc.invalidateQueries({ queryKey: ["comic", comicIdStr] });
      } else {
        qc.invalidateQueries({ queryKey: ["chapters"] });
      }
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    }
  });
  return { ...mutation, isActorReady };
}
function useUpdateReadingProgress() {
  const { actor, isFetching } = useActor(createActor);
  const isActorReady = !!actor && !isFetching;
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ comicId, chapterId, userId }) => {
      if (!actor) throw new Error("Actor not ready");
      return guardedCall(
        () => actor.updateReadingProgress(comicId, chapterId, userId)
      );
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["backend", "progress", vars.userId] });
    }
  });
  return { ...mutation, isActorReady };
}
function useGetReadingProgress(comicId, userId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["readingProgress", comicId == null ? void 0 : comicId.toString(), userId],
    queryFn: async () => {
      if (!actor || comicId === null || !userId) return null;
      return actor.getReadingProgress(comicId, userId);
    },
    enabled: !!actor && !isFetching && comicId !== null && !!userId,
    staleTime: 3e4
  });
}
export {
  useUpdateReadingProgress as a,
  useDeleteChapter as b,
  useGetReadingProgress as c,
  useCreateComic as d,
  useUpdateComic as e,
  useCreateChapter as f,
  useUpdateChapter as g,
  usePublishChapter as h,
  isStoppedCanisterError as i,
  useDeleteComic as j,
  useUnpublishChapter as k,
  useListComics as l,
  useListChapters as u
};
