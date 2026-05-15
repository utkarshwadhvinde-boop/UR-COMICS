import { e as useParams, i as useNavigate, a as useAuth, n as useQueryClient, u as useQuery, r as reactExports, j as jsxRuntimeExports, L as Link, B as BookOpen, D as updateComic, C as setComicGenres, l as listGenres } from "./index-WeXjJ7Am.js";
import { u as useChapters } from "./useChapters-Aezclnad.js";
import { u as useComic } from "./useComic-By0OFq0z.js";
import { d as deleteChapter } from "./chaptersService-CdTVL-Cg.js";
import { u as uploadCoverImage } from "./uploadService-D9zkEjRI.js";
import { C as CircleAlert } from "./circle-alert-BcofmUCO.js";
import { S as Save } from "./save-BU3PmXYN.js";
import { I as Image } from "./image-BcI_hfrN.js";
import { P as Plus } from "./plus-DTpmbqim.js";
import { C as ChevronRight } from "./chevron-right-DnjSOj2h.js";
import { T as Trash2 } from "./trash-2-CtP_VeEb.js";
function EditComicPage() {
  const { comicId } = useParams({ from: "/creator/comics/$comicId" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: comic, isLoading: comicLoading } = useComic(comicId);
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(comicId);
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: listGenres
  });
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [selectedGenres, setSelectedGenres] = reactExports.useState([]);
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (comic) {
      setTitle(comic.title);
      setDescription(comic.description ?? "");
      setSelectedGenres((comic.genres ?? []).map((g) => g.id));
      setCoverPreview(comic.cover_url ?? "");
    }
  }, [comic]);
  const handleCoverChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const toggleGenre = (id) => {
    setSelectedGenres(
      (prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };
  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    setError("");
    try {
      let cover_url = comic == null ? void 0 : comic.cover_url;
      if (coverFile) cover_url = await uploadCoverImage(comicId, coverFile);
      await updateComic(comicId, {
        title: title.trim(),
        description: description.trim() || void 0,
        cover_url
      });
      await setComicGenres(comicId, selectedGenres);
      queryClient.invalidateQueries({ queryKey: ["comic", comicId] });
      navigate({ to: "/creator" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteChapter = async (id) => {
    try {
      await deleteChapter(id);
      queryClient.invalidateQueries({ queryKey: ["chapters", comicId] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chapter");
    } finally {
      setDeleteTarget(null);
    }
  };
  if (comicLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" })
      }
    );
  }
  if (!comic || comic.author_id !== (user == null ? void 0 : user.id)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-4 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Comic not found or you don't have permission." })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white", children: "Edit Comic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleSave,
                disabled: isSaving,
                className: "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all disabled:opacity-50",
                style: { background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" },
                children: [
                  isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                  "Save Changes"
                ]
              }
            )
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-44 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-purple-500/50 flex items-center justify-center bg-white/5 transition-colors", children: coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: coverPreview,
                  alt: title,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/40 p-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-6 h-6 mx-auto mb-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Change cover" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleCoverChange,
                  className: "hidden"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "title-input",
                    className: "block text-sm font-medium text-white/70 mb-2",
                    children: "Title"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "title-input",
                    type: "text",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "desc-input",
                    className: "block text-sm font-medium text-white/70 mb-2",
                    children: "Description"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "desc-input",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    rows: 3,
                    className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-sm font-medium text-white/70 mb-3", children: "Genres" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: genres.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleGenre(g.id),
                className: `px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedGenres.includes(g.id) ? "bg-purple-500 text-white border border-purple-400" : "bg-white/5 text-white/60 border border-white/10 hover:border-purple-500/40"}`,
                children: g.name
              },
              g.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: "Chapters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/creator/comics/$comicId/chapters/new",
                  params: { comicId },
                  className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    "Add Chapter"
                  ]
                }
              )
            ] }),
            chaptersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-14 rounded-xl bg-white/5 animate-pulse"
              },
              `skeleton-edit-${k}`
            )) }) : chapters.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-white/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No chapters yet" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [...chapters].sort(
              (a, b) => a.chapter_number - b.chapter_number
            ).map((chapter) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white text-sm font-medium", children: [
                      "Chapter ",
                      chapter.chapter_number,
                      chapter.title ? ` — ${chapter.title}` : ""
                    ] }),
                    !chapter.is_published && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-yellow-400", children: "Draft" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/creator/comics/$comicId/chapters/$chapterId",
                      params: { comicId, chapterId: chapter.id },
                      className: "p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDeleteTarget(chapter.id),
                      className: "p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ]
              },
              chapter.id
            )) })
          ] })
        ] }),
        deleteTarget && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Delete Chapter?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mb-6", children: "This will permanently delete this chapter and all its pages." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setDeleteTarget(null),
                className: "flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleDeleteChapter(deleteTarget),
                className: "flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30",
                children: "Delete"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
export {
  EditComicPage
};
