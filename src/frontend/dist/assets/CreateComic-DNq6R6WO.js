import { c as createLucideIcon, i as useNavigate, a as useAuth, r as reactExports, u as useQuery, j as jsxRuntimeExports, X, B as BookOpen, z as createComic, C as setComicGenres, l as listGenres } from "./index-WeXjJ7Am.js";
import { c as createChapter } from "./chaptersService-CdTVL-Cg.js";
import { u as uploadCoverImage, a as uploadChapterPage, c as commitChapterUpload, r as rollbackChapterUpload } from "./uploadService-D9zkEjRI.js";
import { C as CircleAlert } from "./circle-alert-BcofmUCO.js";
import { C as ChevronRight } from "./chevron-right-DnjSOj2h.js";
import { I as Image } from "./image-BcI_hfrN.js";
import { C as ChevronLeft } from "./chevron-left-Bkumf7a0.js";
import { U as Upload } from "./upload-BXa8KBwF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
const STEPS = ["Comic Info", "Upload Pages", "Publish"];
function CreateComic() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = reactExports.useState(0);
  const [error, setError] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState("");
  const [selectedGenres, setSelectedGenres] = reactExports.useState([]);
  const [pages, setPages] = reactExports.useState([]);
  const [pagePreviews, setPagePreviews] = reactExports.useState([]);
  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: listGenres
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-screen flex items-center justify-center",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 mx-auto mb-4 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Please sign in to create comics." })
        ] })
      }
    );
  }
  const handleCoverChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const handlePagesChange = (e) => {
    const files = Array.from(e.target.files ?? []).slice(0, 100);
    setPages(files);
    setPagePreviews(files.map((f) => URL.createObjectURL(f)));
  };
  const removePage = (idx) => {
    setPages((p) => p.filter((_, i) => i !== idx));
    setPagePreviews((p) => p.filter((_, i) => i !== idx));
  };
  const toggleGenre = (genreId) => {
    setSelectedGenres(
      (prev) => prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };
  const handlePublish = async () => {
    if (!user || !title.trim()) return;
    if (pages.length === 0) {
      setError("Please upload at least one page.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    setUploadProgress(0);
    let comicId = "";
    let chapterId = "";
    const uploadedPaths = [];
    try {
      let cover_url;
      if (coverFile) {
        const tempId = crypto.randomUUID();
        comicId = tempId;
        cover_url = await uploadCoverImage(tempId, coverFile);
      }
      const comic = await createComic({
        title: title.trim(),
        description: description.trim() || void 0,
        cover_url,
        author_id: user.id
      });
      comicId = comic.id;
      if (selectedGenres.length > 0)
        await setComicGenres(comicId, selectedGenres);
      const chapter = await createChapter({
        comic_id: comicId,
        chapter_number: 1,
        title: "Chapter 1"
      });
      chapterId = chapter.id;
      const imageUrls = [];
      for (let i = 0; i < pages.length; i++) {
        const url = await uploadChapterPage(comicId, chapterId, i, pages[i]);
        imageUrls.push(url);
        uploadedPaths.push(
          `${comicId}/${chapterId}/${String(i).padStart(4, "0")}.${pages[i].name.split(".").pop()}`
        );
        setUploadProgress(Math.round((i + 1) / pages.length * 90));
      }
      await commitChapterUpload(chapterId, imageUrls);
      setUploadProgress(100);
      navigate({ to: `/comic/${comicId}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
      if (comicId && chapterId) {
        await rollbackChapterUpload(comicId, chapterId, uploadedPaths).catch(
          () => {
          }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-8", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? "bg-purple-500 text-white" : "bg-white/10 text-white/40"}`,
              children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : i + 1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-medium ${i === step ? "text-white" : "text-white/40"}`,
              children: s
            }
          ),
          i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-white/20" })
        ] }, s)) }),
        step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white", children: "Comic Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "cover-upload",
                className: "block text-sm font-medium text-white/70 mb-2",
                children: "Cover Image (9:16 ratio)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40 h-56 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-purple-500/50 flex items-center justify-center bg-white/5 transition-colors", children: coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: coverPreview,
                  alt: "Cover",
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-white/40 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-8 h-8 mx-auto mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Upload cover" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "cover-upload",
                  type: "file",
                  accept: "image/*",
                  onChange: handleCoverChange,
                  className: "hidden"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "comic-title",
                className: "block text-sm font-medium text-white/70 mb-2",
                children: "Title *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "comic-title",
                type: "text",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500",
                placeholder: "Your comic title",
                maxLength: 100
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "comic-description",
                className: "block text-sm font-medium text-white/70 mb-2",
                children: "Description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "comic-description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 4,
                className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none",
                placeholder: "What is this comic about?",
                maxLength: 500
              }
            )
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (title.trim()) setStep(1);
                else setError("Please enter a title");
              },
              disabled: !title.trim(),
              className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40",
              style: {
                background: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
              },
              children: [
                "Next: Upload Pages",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] }),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white", children: "Upload Pages" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setStep(0),
                className: "text-white/40 hover:text-white transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-8 text-center bg-white/5 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-10 h-10 mx-auto mb-3 text-purple-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium mb-1", children: "Drop pages here or click to upload" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm", children: "Max 100 images • JPG, PNG, WebP" })
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
          ] }) }),
          pagePreviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/60 text-sm mb-3", children: [
              pagePreviews.length,
              " page",
              pagePreviews.length !== 1 ? "s" : "",
              " selected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-80 overflow-y-auto", children: pagePreviews.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative aspect-[9/14] rounded-lg overflow-hidden group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src,
                      alt: `Page ${idx + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removePage(idx),
                      className: "p-1 rounded-full bg-red-500/80 hover:bg-red-500",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-white" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 rounded px-1", children: idx + 1 })
                ]
              },
              `page-${idx}-${src.slice(-8)}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (pages.length > 0) setStep(2);
                else setError("Please upload at least one page");
              },
              disabled: pages.length === 0,
              className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40",
              style: {
                background: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
              },
              children: [
                "Next: Review & Publish",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              ]
            }
          )
        ] }),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black text-white", children: "Review & Publish" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setStep(1),
                className: "text-white/40 hover:text-white transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/5 border border-white/10 p-4 flex gap-4", children: [
            coverPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: coverPreview,
                alt: title,
                className: "w-20 h-28 object-cover rounded-lg flex-shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white", children: title }),
              description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm mt-1 line-clamp-2", children: description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-purple-400 text-sm mt-2", children: [
                pages.length,
                " page",
                pages.length !== 1 ? "s" : ""
              ] })
            ] })
          ] }),
          isSubmitting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-white/60 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Uploading pages..." }),
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
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 mt-0.5 flex-shrink-0" }),
            error
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handlePublish,
              disabled: isSubmitting,
              className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50",
              style: {
                background: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
              },
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Publishing..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
                "Publish Comic"
              ] })
            }
          )
        ] }),
        error && step !== 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm", children: error })
      ] })
    }
  );
}
export {
  CreateComic as default
};
