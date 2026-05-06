import { y as useActor, z as useQuery, b as useQueryClient, A as useMutation, D as ChapterError, m as createActor } from "./index-B-vfLtPB.js";
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
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createComic(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] })
  });
}
function useUpdateComic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateComic(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comics"] })
  });
}
function useDeleteComic() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteComic(id);
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
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    }
  });
}
function useCreateChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createChapter(input);
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["chapters", vars.comicId.toString()] })
  });
}
function useUpdateChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateChapter(id, input);
      return unwrapResult(result, "updateChapter");
    },
    onSuccess: (_, vars) => qc.invalidateQueries({
      queryKey: ["chapters", vars.input.comicId.toString()]
    })
  });
}
function usePublishChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.publishChapter(id);
      return unwrapResult(result, "publishChapter");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] })
  });
}
function useUnpublishChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.unpublishChapter(id);
      return unwrapResult(result, "unpublishChapter");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] })
  });
}
function useDeleteChapter() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.deleteChapter(id);
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
      } else {
        qc.invalidateQueries({ queryKey: ["chapters"] });
      }
      qc.invalidateQueries({ queryKey: ["comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "comics"] });
      qc.invalidateQueries({ queryKey: ["backend", "trending"] });
    }
  });
}
function useUpdateReadingProgress() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ comicId, chapterId, userId }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateReadingProgress(comicId, chapterId, userId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["backend", "progress", vars.userId] });
    }
  });
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
  useDeleteComic as i,
  useUnpublishChapter as j,
  useListComics as k,
  useListChapters as u
};
