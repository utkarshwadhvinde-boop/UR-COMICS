import { e as useParams, i as useNavigate, n as useQueryClient, r as reactExports, j as jsxRuntimeExports, X } from "./index-WeXjJ7Am.js";
import { u as useChapter } from "./useChapter-qP6IHLah.js";
import { d as deleteChapter, u as updateChapter } from "./chaptersService-CdTVL-Cg.js";
import { a as uploadChapterPage, c as commitChapterUpload, r as rollbackChapterUpload } from "./uploadService-D9zkEjRI.js";
import { C as CircleAlert } from "./circle-alert-BcofmUCO.js";
import { T as Trash2 } from "./trash-2-CtP_VeEb.js";
import { S as Save } from "./save-BU3PmXYN.js";
import { E as Eye } from "./eye-BLpIRN35.js";
import { U as Upload } from "./upload-BXa8KBwF.js";
function EditChapterPage() {
  const { comicId, chapterId } = useParams({
    from: "/creator/comics/$comicId/chapters/$chapterId"
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: chapter, isLoading } = useChapter(comicId, chapterId);
  const [chapterTitle, setChapterTitle] = reactExports.useState("");
  const [chapterNumber, setChapterNumber] = reactExports.useState("");
  const [newPages, setNewPages] = reactExports.useState([]);
  const [newPreviews, setNewPreviews] = reactExports.useState([]);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [showPreview, setShowPreview] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (chapter) {
      setChapterTitle(chapter.title ?? "");
      setChapterNumber(String(chapter.chapter_number));
    }
  }, [chapter]);
  const existingPages = (chapter == null ? void 0 : chapter.pages) ?? [];
  const handlePagesChange = (e) => {
    const files = Array.from(e.target.files ?? []).slice(0, 100);
    setNewPages(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };
  const removePage = (idx) => {
    setNewPages((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };
  const handleSaveMeta = async () => {
    if (!chapterNumber) return;
    setIsSaving(true);
    setError("");
    try {
      await updateChapter(chapterId, {
        title: chapterTitle || void 0,
        chapter_number: Number.parseFloat(chapterNumber)
      });
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };
  const handleUploadAndPublish = async () => {
    if (newPages.length === 0) return;
    setIsUploading(true);
    setError("");
    setUploadProgress(0);
    const uploadedPaths = [];
    const imageUrls = [];
    try {
      for (let i = 0; i < newPages.length; i++) {
        const url = await uploadChapterPage(comicId, chapterId, i, newPages[i]);
        imageUrls.push(url);
        uploadedPaths.push(
          `${comicId}/${chapterId}/${String(i).padStart(4, "0")}.${newPages[i].name.split(".").pop()}`
        );
        setUploadProgress(Math.round((i + 1) / newPages.length * 90));
      }
      await commitChapterUpload(chapterId, imageUrls);
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      setNewPages([]);
      setNewPreviews([]);
      navigate({ to: `/creator/comics/${comicId}/edit` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      if (uploadedPaths.length > 0) {
        await rollbackChapterUpload(comicId, chapterId, uploadedPaths).catch(
          () => {
          }
        );
      }
    } finally {
      setIsUploading(false);
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChapter(chapterId);
      queryClient.invalidateQueries({ queryKey: ["chapters", comicId] });
      navigate({ to: `/creator/comics/${comicId}/edit` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };
  if (isLoading) {
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
  if (!chapter) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-4 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Chapter not found." })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-8 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white", children: "Edit Chapter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleDelete,
              disabled: isDeleting,
              className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                isDeleting ? "Deleting..." : "Delete Chapter"
              ]
            }
          )
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 mt-0.5 flex-shrink-0" }),
          error
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: "Chapter Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "chapter-number-input",
                  className: "block text-sm font-medium text-white/70 mb-2",
                  children: "Chapter Number"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "chapter-number-input",
                  type: "number",
                  value: chapterNumber,
                  onChange: (e) => setChapterNumber(e.target.value),
                  step: "0.1",
                  className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "chapter-title-input",
                  className: "block text-sm font-medium text-white/70 mb-2",
                  children: "Title (optional)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "chapter-title-input",
                  type: "text",
                  value: chapterTitle,
                  onChange: (e) => setChapterTitle(e.target.value),
                  className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500",
                  placeholder: "Chapter title..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleSaveMeta,
              disabled: isSaving,
              className: "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition-all disabled:opacity-50",
              style: { background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" },
              children: [
                isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                "Save Info"
              ]
            }
          )
        ] }),
        existingPages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-white", children: [
              "Current Pages (",
              existingPages.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowPreview(!showPreview),
                className: "flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                  showPreview ? "Hide" : "Preview"
                ]
              }
            )
          ] }),
          showPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-80 overflow-y-auto", children: existingPages.map(
            (page, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative aspect-[9/14] rounded-lg overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: page.image_url,
                      alt: `Page ${idx + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1", children: idx + 1 })
                ]
              },
              page.id
            )
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: existingPages.length > 0 ? "Replace Pages" : "Upload Pages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-6 text-center bg-white/5 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 mx-auto mb-2 text-purple-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-sm", children: "Click to select pages (max 100)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                multiple: true,
                onChange: handlePagesChange,
                className: "hidden"
              }
            )
          ] }),
          newPreviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/60 text-sm mb-3", children: [
              newPreviews.length,
              " new pages selected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-60 overflow-y-auto", children: newPreviews.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative aspect-[9/14] rounded-lg overflow-hidden group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src,
                      alt: `New page ${idx + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removePage(idx),
                      className: "p-1 rounded-full bg-red-500/80",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-white" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1", children: idx + 1 })
                ]
              },
              `preview-${idx}-${src.slice(-8)}`
            )) }),
            isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-white/60 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uploading..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  uploadProgress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all",
                  style: { width: `${uploadProgress}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleUploadAndPublish,
                disabled: isUploading,
                className: "mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50",
                style: {
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
                },
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                  "Uploading..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                  "Upload & Publish"
                ] })
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
export {
  EditChapterPage
};
