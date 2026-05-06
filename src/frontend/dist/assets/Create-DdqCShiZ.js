import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as BookOpen, f as Button, X, U as Upload, l as createActorWithConfig, E as ExternalBlob, m as createActor, k as useNavigate, n as useSearch, u as useAppStore, o as ChapterStatus, h as Badge, I as Input } from "./index-B-vfLtPB.js";
import { A as ALL_GENRES, G as GenreChip } from "./GenreChip-fiAgTmCm.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-r1PDRxL-.js";
import { u as ue } from "./index-CRYEPULx.js";
import { L as LoaderCircle } from "./loader-circle-CEmuWoKy.js";
import { C as CircleCheck, a as CircleAlert } from "./circle-check-BzKjw44a.js";
import { L as Label } from "./label-DiRqCm25.js";
import { T as Textarea } from "./textarea-C-pSGs7O.js";
import { d as useCreateComic, e as useUpdateComic, f as useCreateChapter, g as useUpdateChapter, h as usePublishChapter, u as useListChapters } from "./useComicBackend-DyrWPqgY.js";
import { E as Eye } from "./eye-cDKSMoj1.js";
import { P as Plus } from "./plus-mCe2TKQ9.js";
import "./index-CxrAChpG.js";
import "./index-DHzBZauC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function LazyImage({
  src,
  alt,
  index
}) {
  const [loaded, setLoaded] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: "relative w-full bg-black",
      "data-ocid": `chapter_preview.page.${index + 1}`,
      children: [
        !loaded && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-[3/4] flex items-center justify-center bg-muted/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" }) }),
        loaded && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm", children: index + 1 }),
        visible && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt,
            className: `w-full h-auto block transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}`,
            onLoad: () => setLoaded(true),
            onError: () => {
              setError(true);
              setLoaded(false);
            }
          }
        ),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-[3/4] flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs opacity-60", children: [
            "Page ",
            index + 1,
            " unavailable"
          ] })
        ] })
      ]
    }
  );
}
function ChapterPreviewModal({
  isOpen,
  onClose,
  pages,
  imageOrder,
  chapterTitle,
  chapterNumber
}) {
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const orderedPages = imageOrder.length > 0 ? imageOrder.map((idx) => pages[idx] ?? "").filter(Boolean) : pages.filter(Boolean);
  const title = chapterTitle.trim() || `Chapter ${chapterNumber}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-[9999] flex flex-col",
      style: { background: "#0a0a0f" },
      "aria-modal": "true",
      "aria-label": `Preview: ${title}`,
      "data-ocid": "chapter_preview.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/10",
            style: {
              background: "rgba(10,10,15,0.95)",
              backdropFilter: "blur(8px)"
            },
            "data-ocid": "chapter_preview.header",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/50 leading-none mb-0.5", children: [
                    "Chapter ",
                    chapterNumber,
                    " Preview"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs", children: title })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/40", children: [
                  orderedPages.length,
                  " page",
                  orderedPages.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10",
                    onClick: onClose,
                    "aria-label": "Close preview",
                    "data-ocid": "chapter_preview.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            className: "flex-1 overflow-y-auto overscroll-contain",
            "data-ocid": "chapter_preview.scroll_area",
            children: orderedPages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white/40",
                "data-ocid": "chapter_preview.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No pages uploaded yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-60", children: "Upload images to see your chapter preview" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto w-full", children: [
              orderedPages.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                LazyImage,
                {
                  src,
                  alt: `Page ${idx + 1}`,
                  index: idx
                },
                `${idx}-${src.slice(-20)}`
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 flex flex-col items-center gap-3 border-t border-white/10 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/30 text-sm", children: [
                  "End of preview — ",
                  orderedPages.length,
                  " page",
                  orderedPages.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: "rounded-xl border-white/20 text-white/70 hover:bg-white/10 hover:text-white",
                    onClick: onClose,
                    "data-ocid": "chapter_preview.close_bottom_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-2" }),
                      " Close Preview"
                    ]
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function ImageStitchingModal({
  open,
  onClose,
  onImagesUploaded,
  chapterIndex
}) {
  const [state, setState] = reactExports.useState("idle");
  const [files, setFiles] = reactExports.useState([]);
  const [orderIndices, setOrderIndices] = reactExports.useState([]);
  const [stitchedUrl, setStitchedUrl] = reactExports.useState(null);
  const [stitchedBlob, setStitchedBlob] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [progressLabel, setProgressLabel] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const [dragOrderPos, setDragOrderPos] = reactExports.useState(null);
  const [dragOverPos, setDragOverPos] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const touchOrderPos = reactExports.useRef(null);
  const touchStartY = reactExports.useRef(0);
  const itemHeightRef = reactExports.useRef(0);
  const handleReset = () => {
    for (const f of files) URL.revokeObjectURL(f.previewUrl);
    if (stitchedUrl) URL.revokeObjectURL(stitchedUrl);
    setFiles([]);
    setOrderIndices([]);
    setStitchedUrl(null);
    setStitchedBlob(null);
    setProgress(0);
    setProgressLabel("");
    setError(null);
    setDragOrderPos(null);
    setDragOverPos(null);
    setState("idle");
  };
  const handleClose = () => {
    handleReset();
    onClose();
  };
  const addFiles = reactExports.useCallback((newFiles) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    setFiles((prev) => {
      const startIdx = prev.length;
      const entries = imageFiles.map((f, j) => ({
        id: `${f.name}-${Date.now()}-${j}`,
        file: f,
        previewUrl: URL.createObjectURL(f)
      }));
      setOrderIndices((prevOrder) => [
        ...prevOrder,
        ...imageFiles.map((_, j) => startIdx + j)
      ]);
      const next = [...prev, ...entries];
      if (next.length > 0) setState("reordering");
      return next;
    });
    setError(null);
  }, []);
  const handleFileChange = (e) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };
  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const removeByOrderPos = (pos) => {
    setOrderIndices((prev) => {
      const next = prev.filter((_, i) => i !== pos);
      if (next.length === 0) setState("idle");
      return next;
    });
  };
  const handleDragStart = (e, pos) => {
    setDragOrderPos(pos);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, pos) => {
    e.preventDefault();
    setDragOverPos(pos);
  };
  const handleDrop = (e, dropPos) => {
    e.preventDefault();
    if (dragOrderPos === null || dragOrderPos === dropPos) {
      setDragOrderPos(null);
      setDragOverPos(null);
      return;
    }
    setOrderIndices((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragOrderPos, 1);
      next.splice(dropPos, 0, moved);
      return next;
    });
    setDragOrderPos(null);
    setDragOverPos(null);
  };
  const handleDragEnd = () => {
    setDragOrderPos(null);
    setDragOverPos(null);
  };
  const handleTouchStart = (e, pos) => {
    touchOrderPos.current = pos;
    touchStartY.current = e.touches[0].clientY;
    itemHeightRef.current = e.currentTarget.getBoundingClientRect().height;
  };
  const handleTouchMove = (e) => {
    if (touchOrderPos.current === null) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const steps = Math.round(deltaY / (itemHeightRef.current || 80));
    setDragOverPos(
      Math.max(
        0,
        Math.min(orderIndices.length - 1, touchOrderPos.current + steps)
      )
    );
  };
  const handleTouchEnd = () => {
    if (touchOrderPos.current !== null && dragOverPos !== null && touchOrderPos.current !== dragOverPos) {
      const from = touchOrderPos.current;
      const to = dragOverPos;
      setOrderIndices((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }
    touchOrderPos.current = null;
    setDragOrderPos(null);
    setDragOverPos(null);
  };
  const stitchImages = async () => {
    if (orderIndices.length === 0) return;
    setState("stitching");
    setProgress(0);
    setError(null);
    try {
      const loaded = await Promise.all(
        orderIndices.map(
          (fileIdx, i) => new Promise((resolve, reject) => {
            var _a;
            const img = new window.Image();
            img.onload = () => {
              setProgress(Math.round((i + 1) / orderIndices.length * 40));
              setProgressLabel(
                `Loading image ${i + 1}/${orderIndices.length}...`
              );
              resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image ${i + 1}`));
            img.src = ((_a = files[fileIdx]) == null ? void 0 : _a.previewUrl) ?? "";
          })
        )
      );
      const maxWidth = Math.max(...loaded.map((img) => img.naturalWidth));
      const totalHeight = loaded.reduce((sum, img) => {
        return sum + Math.round(img.naturalHeight * (maxWidth / img.naturalWidth));
      }, 0);
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, maxWidth, totalHeight);
      let yOffset = 0;
      for (let i = 0; i < loaded.length; i++) {
        const img = loaded[i];
        const drawHeight = Math.round(
          img.naturalHeight * (maxWidth / img.naturalWidth)
        );
        ctx.drawImage(img, 0, yOffset, maxWidth, drawHeight);
        yOffset += drawHeight;
        setProgress(40 + Math.round((i + 1) / loaded.length * 50));
        setProgressLabel(`Stitching panel ${i + 1}/${loaded.length}...`);
        await new Promise((r) => setTimeout(r, 0));
      }
      setProgress(95);
      setProgressLabel("Finalizing...");
      const blob = await new Promise(
        (resolve, reject) => canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error("Canvas export failed")),
          "image/jpeg",
          0.92
        )
      );
      const url = URL.createObjectURL(blob);
      setStitchedBlob(blob);
      setStitchedUrl(url);
      setProgress(100);
      setProgressLabel("Stitched successfully!");
      setState("preview");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Stitching failed. Please try again."
      );
      setState("reordering");
    }
  };
  const handleDownload = () => {
    if (!stitchedUrl || !stitchedBlob) return;
    const a = document.createElement("a");
    a.href = stitchedUrl;
    a.download = `chapter-${chapterIndex + 1}-stitched.jpg`;
    a.click();
    ue.success("Image downloaded!");
  };
  const handleUploadToChapter = () => {
    if (!stitchedUrl) return;
    onImagesUploaded([stitchedUrl]);
    ue.success("Chapter images updated!", {
      description: "Stitched image added to your chapter."
    });
    setState("done");
  };
  const isIdle = state === "idle";
  const isReordering = state === "reordering";
  const isStitching = state === "stitching";
  const isPreview = state === "preview";
  const isDone = state === "done";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "modal-glass max-w-2xl w-full sm:max-w-2xl p-0 overflow-hidden animate-scale-in gap-0 max-h-[92vh] flex flex-col",
      "data-ocid": "stitch.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "px-5 pt-5 pb-4 border-b border-border/40 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold text-lg text-foreground", children: "Image Stitching Zone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth",
                "aria-label": "Close modal",
                "data-ocid": "stitch.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] }),
          orderIndices.length > 0 && !isStitching && !isPreview && !isDone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
              orderIndices.length,
              " image",
              orderIndices.length !== 1 ? "s" : ""
            ] }),
            " ",
            "selected — drag to reorder"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-y-auto flex-1 p-5 space-y-4", children: [
          !isStitching && !isPreview && !isDone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `relative rounded-2xl border-2 border-dashed transition-smooth ${isDragOver ? "drop-zone-active border-primary" : "border-border/60 hover:border-primary/50 hover:bg-primary/5"}`,
              onDragOver: (e) => {
                e.preventDefault();
                setIsDragOver(true);
              },
              onDragLeave: () => setIsDragOver(false),
              onDrop: handleDropZoneDrop,
              "data-ocid": "stitch.dropzone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    className: "flex flex-col items-center justify-center py-8 px-4 gap-2 cursor-pointer select-none w-full",
                    htmlFor: "stitch-file-input",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-12 h-12 rounded-xl flex items-center justify-center transition-smooth ${isDragOver ? "bg-primary/20" : "bg-muted/60"}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ImagePlus,
                            {
                              className: `w-6 h-6 ${isDragOver ? "text-primary" : "text-muted-foreground"}`
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: isIdle ? "Drag & Drop or Click to Upload" : "Add More Images" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "JPEG, PNG, WebP — multiple selection supported" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "stitch-file-input",
                    ref: fileInputRef,
                    type: "file",
                    accept: "image/*",
                    multiple: true,
                    className: "sr-only",
                    onChange: handleFileChange,
                    "data-ocid": "stitch.file_input"
                  }
                )
              ]
            }
          ),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive",
              "data-ocid": "stitch.error_state",
              children: error
            }
          ),
          isReordering && orderIndices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "stitch.image_list", children: orderIndices.map((fileIdx, pos) => {
            const entry = files[fileIdx];
            if (!entry) return null;
            const isActive = dragOrderPos === pos;
            const isOver = dragOverPos === pos && dragOrderPos !== pos;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                draggable: true,
                onDragStart: (e) => handleDragStart(e, pos),
                onDragOver: (e) => handleDragOver(e, pos),
                onDrop: (e) => handleDrop(e, pos),
                onDragEnd: handleDragEnd,
                onTouchStart: (e) => handleTouchStart(e, pos),
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
                className: `flex items-center gap-3 rounded-xl border p-2 transition-smooth cursor-grab active:cursor-grabbing ${isActive ? "drag-item-active border-primary/50 bg-primary/10 shadow-glow" : isOver ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/20"}`,
                "data-ocid": `stitch.image_item.${pos + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: entry.previewUrl,
                        alt: `Page ${pos + 1}`,
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center shadow", children: pos + 1 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
                      "Page ",
                      pos + 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: entry.file.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeByOrderPos(pos),
                      className: "w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0",
                      "aria-label": `Remove page ${pos + 1}`,
                      "data-ocid": `stitch.remove_image_button.${pos + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              },
              `${entry.id}-${pos}`
            );
          }) }),
          isStitching && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-5", "data-ocid": "stitch.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: orderIndices.slice(0, 6).map((fileIdx, _i) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "aspect-[3/4] rounded-lg overflow-hidden bg-muted",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: (_a = files[fileIdx]) == null ? void 0 : _a.previewUrl,
                      alt: "",
                      className: "w-full h-full object-cover"
                    }
                  )
                },
                fileIdx
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary mx-auto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-2 rounded-full bg-muted overflow-hidden relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full gradient-primary transition-all duration-300 ease-out",
                      style: { width: `${progress}%` }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0 opacity-40 animate-[progress-shimmer_2s_linear_infinite] [background-size:200px_100%]",
                      style: {
                        background: "linear-gradient(90deg, transparent, oklch(var(--foreground) / 0.3), transparent)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: progressLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary font-semibold mt-1", children: [
                  progress,
                  "%"
                ] })
              ] })
            ] })
          ] }),
          (isPreview || isDone) && stitchedUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/30 px-4 py-3",
                "data-ocid": "stitch.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Stitched Successfully" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      orderIndices.length,
                      " panels merged in your chosen order"
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: orderIndices.map((fileIdx, i) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative aspect-[3/4] rounded-lg overflow-hidden bg-muted",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: (_a = files[fileIdx]) == null ? void 0 : _a.previewUrl,
                        alt: `Panel ${i + 1}`,
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center shadow", children: i + 1 })
                  ]
                },
                fileIdx
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden border border-border/40 bg-muted max-h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: stitchedUrl,
                alt: "Stitched chapter preview",
                className: "w-full object-contain max-h-56",
                "data-ocid": "stitch.preview_image"
              }
            ) }),
            isDone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground", children: "Chapter updated. You can stitch another batch or close." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 pt-4 border-t border-border/40 shrink-0 space-y-3", children: [
          isReordering && orderIndices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "stitch-file-input",
                className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-background hover:bg-muted/40 transition-smooth cursor-pointer",
                "data-ocid": "stitch.add_more_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-3.5 h-3.5" }),
                  " Add More"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "flex-1 gradient-primary text-primary-foreground border-0 rounded-xl font-semibold gap-2 shadow-glow",
                onClick: stitchImages,
                "data-ocid": "stitch.stitch_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                  "Stitch ",
                  orderIndices.length,
                  " Panel",
                  orderIndices.length !== 1 ? "s" : ""
                ]
              }
            )
          ] }),
          (isPreview || isDone) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "flex-1 gradient-primary text-primary-foreground border-0 rounded-xl font-semibold gap-2 shadow-glow",
                onClick: handleUploadToChapter,
                disabled: isDone,
                "data-ocid": "stitch.upload_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                  isDone ? "Added to Chapter ✓" : "Auto-upload to Chapter"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 rounded-xl font-semibold gap-2",
                onClick: handleDownload,
                "data-ocid": "stitch.download_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
                  "Download Stitched Image"
                ]
              }
            )
          ] }),
          (isPreview || isDone) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "w-full rounded-xl text-xs text-muted-foreground",
              onClick: handleReset,
              "data-ocid": "stitch.stitch_another_button",
              children: "Stitch Another Batch"
            }
          ),
          isIdle && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "stitch-file-input",
              className: "w-full gradient-primary text-primary-foreground rounded-xl font-semibold gap-2 shadow-glow h-10 flex items-center justify-center cursor-pointer transition-smooth hover:opacity-90 select-none",
              "data-ocid": "stitch.open_gallery_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }),
                "Select Images from Gallery"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
const MOTOKO_SENTINEL = "!caf!";
const ALLOWED_MIME_TYPES = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);
const EXT_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif"
};
function validateAndCoerceImageFile(file) {
  var _a;
  if (file.size === 0) {
    throw new Error(
      `File "${file.name}" is empty (0 bytes). Please re-select it from your gallery.`
    );
  }
  let mimeType = file.type;
  if (!mimeType || mimeType === "application/octet-stream") {
    const ext = ((_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase()) ?? "";
    const detected = EXT_TO_MIME[ext];
    if (detected) {
      mimeType = detected;
      console.info(
        `[storageUpload] MIME inferred from extension .${ext} → ${mimeType} for "${file.name}"`
      );
      return new File([file], file.name, {
        type: mimeType,
        lastModified: file.lastModified
      });
    }
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      `File "${file.name}" has unsupported type "${mimeType || "(none)"}". Only JPEG, PNG, WebP, and GIF are allowed.`
    );
  }
  return file;
}
let _fns = null;
async function getStorageFns() {
  _fns = null;
  return new Promise((resolve, reject) => {
    const capturingFactory = (canisterId, uploadFile, downloadFile, options) => {
      if (!_fns) {
        _fns = { uploadFile, downloadFile };
        resolve(_fns);
      }
      return createActor(canisterId, uploadFile, downloadFile, options);
    };
    createActorWithConfig(capturingFactory).catch((err) => {
      console.warn("storageUpload: actor init error", err);
      reject(err);
    });
  });
}
async function uploadWithRetry(uploadFile, downloadFile, file, label) {
  const MAX_RETRIES = 3;
  const DELAYS = [500, 1e3, 2e3];
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes.length === 0) {
        throw new Error(
          `Zero-byte file detected for "${label}" — skipping upload`
        );
      }
      const hashEncoded = await uploadFile(ExternalBlob.fromBytes(bytes));
      const hashWithPrefix = new TextDecoder().decode(hashEncoded);
      if (!hashWithPrefix || hashWithPrefix.trim().length === 0) {
        throw new Error(
          `Upload of "${label}" returned an empty hash — treating as failure`
        );
      }
      const hash = hashWithPrefix.startsWith(MOTOKO_SENTINEL) ? hashWithPrefix.slice(MOTOKO_SENTINEL.length) : hashWithPrefix;
      const blob = await downloadFile(
        new TextEncoder().encode(MOTOKO_SENTINEL + hash)
      );
      return blob.getDirectURL();
    } catch (err) {
      lastErr = err;
      const rawMsg = err instanceof Error ? err.message : String(err);
      let reason = rawMsg;
      if (/403|forbidden/i.test(rawMsg))
        reason = `Permission denied (403): ${rawMsg}`;
      else if (/401|unauthorized/i.test(rawMsg))
        reason = `Auth expired (401): ${rawMsg}`;
      else if (/timeout|timed out/i.test(rawMsg)) reason = `Timeout: ${rawMsg}`;
      else if (/cors/i.test(rawMsg)) reason = `CORS error: ${rawMsg}`;
      else if (/mime|content.type/i.test(rawMsg))
        reason = `Invalid MIME type: ${rawMsg}`;
      console.error(
        `[storageUpload] Upload attempt ${attempt}/${MAX_RETRIES} FAILED for "${label}": ${reason}`,
        err
      );
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, DELAYS[attempt - 1]));
      }
    }
  }
  const finalReason = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(
    `Upload failed after ${MAX_RETRIES} attempts for "${label}": ${finalReason}`
  );
}
async function uploadFileToStorage(file) {
  const { uploadFile, downloadFile } = await getStorageFns();
  let validatedFile;
  if (file instanceof File) {
    try {
      validatedFile = validateAndCoerceImageFile(file);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[storageUpload] Validation FAILED: ${reason}`, err);
      throw err;
    }
  } else {
    validatedFile = new File([file], "upload.jpg", {
      type: file.type || "image/jpeg"
    });
  }
  return uploadWithRetry(
    uploadFile,
    downloadFile,
    validatedFile,
    validatedFile.name
  );
}
function StatusToggle({
  value,
  onChange
}) {
  const options = [
    {
      value: "ongoing",
      label: "Ongoing",
      color: "bg-primary text-primary-foreground"
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-accent text-accent-foreground"
    },
    {
      value: "hiatus",
      label: "Hiatus",
      color: "bg-muted text-muted-foreground"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", "data-ocid": "create.status_toggle", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onChange(opt.value),
      className: `px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border ${value === opt.value ? `${opt.color} border-primary/30 shadow-sm` : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"}`,
      "data-ocid": `create.status.${opt.value}`,
      children: opt.label
    },
    opt.value
  )) });
}
function UploadProgressBar({ progress }) {
  if (progress.total === 0) return null;
  const pct = Math.round(progress.done / progress.total * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl bg-muted/40 border border-border px-4 py-3",
      "data-ocid": "create.upload_progress",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground", children: [
            "Uploading images… ",
            progress.done,
            " of ",
            progress.total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-primary rounded-full transition-all duration-300",
            style: { width: `${pct}%` }
          }
        ) })
      ]
    }
  );
}
function PageThumbnailRow({
  images,
  imageOrder,
  locked,
  onDrop,
  onRetry
}) {
  const [dragging, setDragging] = reactExports.useState(null);
  const [over, setOver] = reactExports.useState(null);
  if (images.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-2 overflow-x-auto pb-2 mt-3",
      "data-ocid": "create.chapter.page_thumbnails",
      children: imageOrder.map((imgIdx, pos) => {
        const img = images[imgIdx];
        const state = (img == null ? void 0 : img.uploadState) ?? "idle";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            draggable: !locked && state !== "uploading",
            onDragStart: () => !locked && state !== "uploading" && setDragging(pos),
            onDragOver: (e) => {
              if (locked || state === "uploading") return;
              e.preventDefault();
              setOver(pos);
            },
            onDrop: (e) => {
              if (locked || state === "uploading") return;
              e.preventDefault();
              if (dragging !== null && dragging !== pos) onDrop(dragging, pos);
              setDragging(null);
              setOver(null);
            },
            onDragEnd: () => {
              setDragging(null);
              setOver(null);
            },
            className: `relative shrink-0 w-16 h-24 rounded-xl overflow-hidden border-2 transition-smooth ${locked ? "cursor-default border-border" : dragging === pos ? "opacity-40 border-primary cursor-grab" : over === pos ? "border-primary scale-105 cursor-grab" : state === "error" ? "border-destructive cursor-grab" : "border-border cursor-grab"}`,
            "data-ocid": `create.chapter.thumbnail.${pos + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: img.preview,
                  alt: `Page ${pos + 1}`,
                  className: "w-full h-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 left-1 w-5 h-5 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center shadow", children: pos + 1 }),
              state === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute bottom-1 right-1 w-4 h-4 rounded-full bg-background/80 flex items-center justify-center",
                  title: "Uploading…",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-muted-foreground/40 border-t-primary rounded-full animate-spin" })
                }
              ),
              state === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 shadow",
                  title: "Uploaded"
                }
              ),
              state === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute bottom-1 right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center shadow",
                  title: img.uploadError ?? "Upload failed — tap to retry",
                  onClick: (e) => {
                    e.stopPropagation();
                    onRetry(imgIdx);
                  },
                  "data-ocid": `create.chapter.thumbnail_retry.${pos + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive-foreground text-[8px] font-bold leading-none", children: "!" })
                }
              )
            ]
          },
          `${pos}-${imgIdx}`
        );
      })
    }
  );
}
function PublishConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isLoading,
  progress,
  error,
  onDismissError
}) {
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4",
      "data-ocid": "create.publish_dialog",
      style: { touchAction: "manipulation" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-lg animate-scale-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl mb-3 text-center", children: "🚀" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground text-center mb-2", children: "Ready to Publish?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-4", children: "This chapter will be visible to all users immediately." }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3",
            "data-ocid": "create.publish_error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive mb-0.5", children: "Publish failed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive/80 whitespace-pre-wrap break-words", children: error })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "text-destructive/60 hover:text-destructive transition-colors shrink-0",
                    onClick: onDismissError,
                    "aria-label": "Dismiss error",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
                "Your draft and uploaded images are safe. Tap",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Publish Now" }),
                " to retry."
              ] })
            ]
          }
        ),
        isLoading && progress.total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UploadProgressBar, { progress }) }),
        isLoading && progress.total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full" }),
          "Publishing…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "flex-1 rounded-xl",
              onClick: onCancel,
              disabled: isLoading,
              "data-ocid": "create.publish_cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              className: "flex-1 gradient-primary text-primary-foreground border-0 rounded-xl shadow-glow gap-2",
              onClick: onConfirm,
              disabled: isLoading,
              style: { touchAction: "manipulation" },
              "data-ocid": "create.publish_confirm_button",
              children: [
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                isLoading ? "Publishing…" : error ? "Retry Publish" : "Publish Now"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function ChapterEditor({
  chapters,
  isPublishing,
  onAdd,
  onRemove,
  onChange,
  onStitchImages,
  onThumbnailDrop,
  onImageUpload,
  onPreview,
  onRetryImageUpload
}) {
  const [expanded, setExpanded] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold", children: [
        "Chapters",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground font-normal", children: [
          "(",
          chapters.length,
          " total)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: onAdd,
          disabled: isPublishing,
          className: "rounded-xl gap-1",
          "data-ocid": "create.add_chapter_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add Chapter"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: chapters.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border bg-card overflow-hidden",
        "data-ocid": `create.chapter.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-muted/20 transition-colors text-left",
              onClick: () => setExpanded(expanded === i ? null : i),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: ch.chapterNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: ch.title,
                    onClick: (e) => e.stopPropagation(),
                    onChange: (e) => onChange(i, "title", e.target.value),
                    placeholder: `Chapter ${ch.chapterNumber} title`,
                    className: "rounded-lg h-8 text-sm border-0 bg-transparent focus-visible:ring-1 px-2",
                    "data-ocid": `create.chapter.title_input.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${ch.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border"}`,
                    children: ch.status === "published" ? "Live" : "Draft"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: expanded === i ? "▲" : "▼" }),
                  chapters.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: isPublishing,
                      onClick: (e) => {
                        e.stopPropagation();
                        onRemove(i);
                      },
                      className: "ml-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40",
                      "data-ocid": `create.chapter.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            }
          ),
          expanded === i && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 border-t border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1 block", children: "Chapter Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  value: ch.chapterNumber,
                  onChange: (e) => onChange(i, "chapterNumber", e.target.value),
                  className: "rounded-xl h-8 w-28 text-sm",
                  "data-ocid": `create.chapter.number_input.${i + 1}`
                }
              )
            ] }),
            !ch.orderLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: `chapter-img-input-${i}`,
                className: "flex flex-col items-center justify-center w-full min-h-[80px] rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-smooth mt-2 gap-1",
                "data-ocid": `create.chapter.image_upload.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-5 h-5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: ch.images.length > 0 ? `${ch.images.length} page${ch.images.length !== 1 ? "s" : ""} — click to add more` : "Upload chapter images (multi-select supported)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: `chapter-img-input-${i}`,
                      type: "file",
                      accept: "image/*",
                      multiple: true,
                      className: "sr-only",
                      onChange: (e) => {
                        if (e.target.files)
                          onImageUpload(i, Array.from(e.target.files));
                        e.target.value = "";
                      }
                    }
                  )
                ]
              }
            ),
            ch.orderLocked && ch.images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 shrink-0" }),
              "Order locked after preview. ",
              ch.images.length,
              " page",
              ch.images.length !== 1 ? "s" : "",
              " ready to publish."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PageThumbnailRow,
              {
                images: ch.images,
                imageOrder: ch.imageOrder,
                locked: ch.orderLocked,
                onDrop: (from, to) => onThumbnailDrop(i, from, to),
                onRetry: (imgIdx) => onRetryImageUpload(i, imgIdx)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ch.orderLocked ? "Preview locked — order is final." : "Drag thumbnails to reorder before publishing." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
                ch.images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10",
                    onClick: () => onPreview(i),
                    "data-ocid": `create.chapter.preview_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
                      "Preview"
                    ]
                  }
                ),
                !ch.orderLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10",
                    onClick: () => onStitchImages(i),
                    "data-ocid": `create.chapter.stitch_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
                      "Stitch Images"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ]
      },
      `${ch.chapterNumber}-${ch.title}`
    )) })
  ] });
}
function CreatePage() {
  var _a, _b, _c, _d, _e;
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const editId = search == null ? void 0 : search.edit;
  const { currentUser, comics, addComic } = useAppStore();
  const existing = editId ? comics.find((c) => c.id === editId) : null;
  const existingBackendId = (existing == null ? void 0 : existing.backendId) ?? null;
  const [title, setTitle] = reactExports.useState((existing == null ? void 0 : existing.title) ?? "");
  const [description, setDescription] = reactExports.useState((existing == null ? void 0 : existing.description) ?? "");
  const [selectedGenres, setSelectedGenres] = reactExports.useState(
    (existing == null ? void 0 : existing.genres) ?? []
  );
  const [coverUrl, setCoverUrl] = reactExports.useState((existing == null ? void 0 : existing.coverImage) ?? "");
  const [coverPreview, setCoverPreview] = reactExports.useState((existing == null ? void 0 : existing.coverImage) ?? "");
  const [status, setStatus] = reactExports.useState(
    (existing == null ? void 0 : existing.status) ?? "ongoing"
  );
  const [chapters, setChapters] = reactExports.useState(
    (existing == null ? void 0 : existing.chapters.map((ch, i) => ({
      title: ch.title,
      images: (ch.pages ?? []).map((url) => ({
        preview: url,
        file: null,
        permanentUrl: url.startsWith("blob:") ? null : url,
        uploadState: url.startsWith("blob:") ? "idle" : "done"
      })),
      imageOrder: ch.imageOrder ?? (ch.pages ?? []).map((_, idx) => idx),
      orderLocked: false,
      backendId: ch.backendId ?? null,
      chapterNumber: ch.chapterNumber ?? i + 1,
      status: ch.chapterStatus ?? "draft"
    }))) ?? [
      {
        title: "Chapter 1",
        images: [],
        imageOrder: [],
        orderLocked: false,
        backendId: null,
        chapterNumber: 1,
        status: "draft"
      }
    ]
  );
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isPublishing, setIsPublishing] = reactExports.useState(false);
  const [publishError, setPublishError] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState({
    done: 0,
    total: 0
  });
  const [savedAt, setSavedAt] = reactExports.useState(null);
  const [stitchModalOpen, setStitchModalOpen] = reactExports.useState(false);
  const [stitchTargetChapter, setStitchTargetChapter] = reactExports.useState(0);
  const [publishConfirmOpen, setPublishConfirmOpen] = reactExports.useState(false);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [previewChapterIdx, setPreviewChapterIdx] = reactExports.useState(0);
  const [publishedComicId, setPublishedComicId] = reactExports.useState(null);
  const [publishedChapterId, setPublishedChapterId] = reactExports.useState(
    null
  );
  const [publishSuccessOpen, setPublishSuccessOpen] = reactExports.useState(false);
  const [backendComicId, setBackendComicId] = reactExports.useState(
    existingBackendId
  );
  const hasUnsavedRef = reactExports.useRef(false);
  const isPublishingRef = reactExports.useRef(false);
  const activeUploadsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const blobUrlsRef = reactExports.useRef([]);
  const createComicMutation = useCreateComic();
  const updateComicMutation = useUpdateComic();
  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();
  const publishChapterMutation = usePublishChapter();
  const { data: existingChapters } = useListChapters(backendComicId, false);
  reactExports.useEffect(() => {
    hasUnsavedRef.current = true;
  }, [title, description, selectedGenres, coverUrl, status, chapters]);
  reactExports.useEffect(() => {
    if (!backendComicId) return;
    const id = setInterval(() => {
      if (hasUnsavedRef.current) void doSaveDraft(true);
    }, 3e4);
    return () => clearInterval(id);
  }, [backendComicId]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (hasUnsavedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  reactExports.useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      }
    };
  }, []);
  const toggleGenre = (genre) => {
    if (genre === "All") return;
    setSelectedGenres(
      (prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };
  const handleFileUpload = async (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCoverPreview(blobUrl);
    setCoverUrl("");
    try {
      const permanentUrl = await uploadFileToStorage(file);
      setCoverUrl(permanentUrl);
      setCoverPreview(permanentUrl);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setCoverUrl("");
      const reason = err instanceof Error ? err.message : String(err);
      ue.error(`Cover upload failed: ${reason}. Please try again.`);
    }
  };
  const addChapterDraft = () => setChapters((prev) => [
    ...prev,
    {
      title: `Chapter ${prev.length + 1}`,
      images: [],
      imageOrder: [],
      orderLocked: false,
      backendId: null,
      chapterNumber: prev.length + 1,
      status: "draft"
    }
  ]);
  const removeChapterDraft = (idx) => setChapters((prev) => prev.filter((_, i) => i !== idx));
  const updateChapterField = (i, field, val) => setChapters(
    (prev) => prev.map(
      (c, idx) => idx === i ? {
        ...c,
        [field]: field === "chapterNumber" ? Number.parseInt(val) || 1 : val
      } : c
    )
  );
  const handleImageUpload = (chapterIdx, files) => {
    const valid = [];
    const invalid = [];
    for (const raw of files) {
      try {
        const coerced = validateAndCoerceImageFile(raw);
        valid.push(coerced);
      } catch {
        invalid.push(raw.name);
      }
    }
    if (invalid.length > 0) {
      ue.error(
        `Skipped ${invalid.length} invalid file(s): ${invalid.slice(0, 3).join(", ")}`
      );
    }
    if (valid.length === 0) return;
    const newEntries = valid.map((f) => {
      const blobUrl = URL.createObjectURL(f);
      blobUrlsRef.current.push(blobUrl);
      return {
        preview: blobUrl,
        // CRITICAL: Keep File reference alive — never nullify until publish is done
        file: f,
        permanentUrl: null,
        uploadState: "uploading"
      };
    });
    let startIdx = 0;
    setChapters(
      (prev) => prev.map((ch, i) => {
        if (i !== chapterIdx) return ch;
        startIdx = ch.images.length;
        return {
          ...ch,
          images: [...ch.images, ...newEntries],
          imageOrder: [
            ...ch.imageOrder,
            ...newEntries.map((_, j) => startIdx + j)
          ]
        };
      })
    );
    valid.forEach((file, j) => {
      const imgIdx = startIdx + j;
      const uploadKey = `${chapterIdx}-${imgIdx}-${Date.now()}`;
      activeUploadsRef.current.add(uploadKey);
      void (async () => {
        try {
          const permanentUrl = await uploadFileToStorage(file);
          setChapters(
            (prev) => prev.map((ch, i) => {
              if (i !== chapterIdx) return ch;
              const updated = ch.images.map((img, k) => {
                if (k !== imgIdx) return img;
                return {
                  ...img,
                  // Replace blob preview with permanent URL
                  preview: permanentUrl,
                  permanentUrl,
                  uploadState: "done",
                  uploadError: void 0
                };
              });
              return { ...ch, images: updated };
            })
          );
        } catch (err) {
          const reason = err instanceof Error ? err.message : String(err);
          console.error(
            `[BgUpload] Chapter ${chapterIdx} image ${imgIdx} failed: ${reason}`
          );
          setChapters(
            (prev) => prev.map((ch, i) => {
              if (i !== chapterIdx) return ch;
              const updated = ch.images.map((img, k) => {
                if (k !== imgIdx) return img;
                return {
                  ...img,
                  uploadState: "error",
                  uploadError: reason
                };
              });
              return { ...ch, images: updated };
            })
          );
        } finally {
          activeUploadsRef.current.delete(uploadKey);
        }
      })();
    });
  };
  const handleThumbnailDrop = (_chapterIdx, fromPos, toPos) => {
    setChapters(
      (prev) => prev.map((ch, i) => {
        if (i !== _chapterIdx || ch.orderLocked) return ch;
        const newOrder = [...ch.imageOrder];
        const [moved] = newOrder.splice(fromPos, 1);
        newOrder.splice(toPos, 0, moved);
        return { ...ch, imageOrder: newOrder };
      })
    );
  };
  const handleRetryImageUpload = (chapterIdx, imgIdx) => {
    const chapter = chapters[chapterIdx];
    const img = chapter == null ? void 0 : chapter.images[imgIdx];
    if (!(img == null ? void 0 : img.file)) {
      ue.error(
        `Cannot retry image ${imgIdx + 1}: file reference is lost. Please re-upload.`
      );
      return;
    }
    const file = img.file;
    setChapters(
      (prev) => prev.map((ch, i) => {
        if (i !== chapterIdx) return ch;
        const updated = ch.images.map(
          (m, k) => k === imgIdx ? {
            ...m,
            uploadState: "uploading",
            uploadError: void 0
          } : m
        );
        return { ...ch, images: updated };
      })
    );
    const uploadKey = `retry-${chapterIdx}-${imgIdx}-${Date.now()}`;
    activeUploadsRef.current.add(uploadKey);
    void (async () => {
      try {
        const permanentUrl = await uploadFileToStorage(file);
        setChapters(
          (prev) => prev.map((ch, i) => {
            if (i !== chapterIdx) return ch;
            const updated = ch.images.map(
              (m, k) => k === imgIdx ? {
                ...m,
                preview: permanentUrl,
                permanentUrl,
                uploadState: "done",
                uploadError: void 0
              } : m
            );
            return { ...ch, images: updated };
          })
        );
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        setChapters(
          (prev) => prev.map((ch, i) => {
            if (i !== chapterIdx) return ch;
            const updated = ch.images.map(
              (m, k) => k === imgIdx ? {
                ...m,
                uploadState: "error",
                uploadError: reason
              } : m
            );
            return { ...ch, images: updated };
          })
        );
        ue.error(`Retry failed for image ${imgIdx + 1}: ${reason}`);
      } finally {
        activeUploadsRef.current.delete(uploadKey);
      }
    })();
  };
  const handlePreviewChapter = (idx) => {
    setPreviewChapterIdx(idx);
    setPreviewOpen(true);
    setChapters(
      (prev) => prev.map(
        (ch, i) => i === idx && !ch.orderLocked ? { ...ch, orderLocked: true } : ch
      )
    );
  };
  async function uploadChapterImages(ch, _chapterIdx, comicBackendId, chapterBackendId, progressOffset, _totalImages, onProgress) {
    var _a2, _b2;
    const updated = [...ch.images];
    const ts = Date.now();
    const randomTag = Math.random().toString(36).slice(2, 7);
    for (let imgIdx = 0; imgIdx < ch.images.length; imgIdx++) {
      const img = ch.images[imgIdx];
      if (img.permanentUrl) {
        onProgress(progressOffset + imgIdx + 1);
        continue;
      }
      const ext = ((_b2 = (_a2 = img.file) == null ? void 0 : _a2.name.split(".").pop()) == null ? void 0 : _b2.toLowerCase()) ?? "jpg";
      const pageNum = String(imgIdx + 1).padStart(2, "0");
      const uniqueName = `${comicBackendId}/${chapterBackendId ?? "new"}/${ts}-${randomTag}-page${pageNum}.${ext}`;
      let fileToUpload;
      if (img.file) {
        try {
          fileToUpload = validateAndCoerceImageFile(img.file);
        } catch {
          fileToUpload = img.file;
        }
        fileToUpload = new File([fileToUpload], uniqueName, {
          type: fileToUpload.type
        });
      } else if (img.preview.startsWith("blob:")) {
        throw new Error(
          `Image ${imgIdx + 1} in Chapter ${ch.chapterNumber} could not be uploaded — the file reference was lost. Please remove this image and re-upload it from your gallery.`
        );
      } else {
        updated[imgIdx] = {
          ...img,
          permanentUrl: img.preview,
          uploadState: "done"
        };
        onProgress(progressOffset + imgIdx + 1);
        continue;
      }
      try {
        const permanentUrl = await uploadFileToStorage(fileToUpload);
        updated[imgIdx] = {
          // CRITICAL: Keep original File reference — do NOT nullify file
          preview: permanentUrl,
          file: img.file,
          // keep original File so retries can re-use it
          permanentUrl,
          uploadState: "done"
        };
        onProgress(progressOffset + imgIdx + 1);
      } catch (uploadErr) {
        const reason = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
        console.error(
          `[Publish] Upload FAILED for image ${imgIdx + 1} in chapter "${ch.title}":`,
          reason,
          uploadErr
        );
        throw new Error(
          `Image ${imgIdx + 1} in Chapter "${ch.title}" failed to upload.
${reason}`
        );
      }
    }
    return updated;
  }
  async function doSaveDraft(silent = false) {
    if (!title.trim()) {
      if (!silent) ue.error("Please enter a title first");
      return { comicId: null, updatedChapters: chapters };
    }
    setIsSaving(true);
    try {
      let comicId = backendComicId;
      let finalCoverUrl = coverUrl;
      if (!finalCoverUrl || finalCoverUrl.startsWith("blob:")) {
        finalCoverUrl = "/assets/generated/cover-lost-realm.dim_400x600.jpg";
        setCoverUrl(finalCoverUrl);
        setCoverPreview(finalCoverUrl);
      }
      const comicInput = {
        title: title.trim(),
        description: description.trim(),
        author: (currentUser == null ? void 0 : currentUser.username) ?? "Anonymous",
        coverUrl: finalCoverUrl || "/assets/generated/cover-lost-realm.dim_400x600.jpg",
        genres: selectedGenres,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        isPinned: false,
        ownerUploaded: false,
        creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous"
      };
      if (!comicId) {
        const newId = await createComicMutation.mutateAsync(comicInput);
        comicId = newId;
        setBackendComicId(newId);
        const localComic = {
          id: String(newId),
          backendId: newId,
          title: title.trim(),
          description: description.trim(),
          author: (currentUser == null ? void 0 : currentUser.username) ?? "Anonymous",
          coverImage: finalCoverUrl,
          genres: selectedGenres,
          status,
          likes: 0,
          views: 0,
          rating: 0,
          chapters: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFeatured: false,
          isTrending: false,
          isPremium: false,
          isPinned: false,
          creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous",
          isOwnerComic: false
        };
        addComic(localComic);
      } else {
        await updateComicMutation.mutateAsync({
          id: comicId,
          input: comicInput
        });
      }
      const updatedChapters = await Promise.all(
        chapters.map(async (ch) => {
          const dup = existingChapters == null ? void 0 : existingChapters.find(
            (ec) => Number(ec.chapterNumber) === ch.chapterNumber && (ch.backendId === null || ec.id !== ch.backendId)
          );
          if (dup) {
            if (!silent)
              ue.error(
                `Chapter ${ch.chapterNumber} already exists. Use a different number.`
              );
            return ch;
          }
          const updatedImages = await Promise.all(
            ch.images.map(async (img) => {
              if (img.permanentUrl) return img;
              if (!img.file) return img;
              try {
                const permanentUrl = await uploadFileToStorage(img.file);
                return {
                  preview: permanentUrl,
                  file: img.file,
                  permanentUrl,
                  uploadState: "done"
                };
              } catch {
                return img;
              }
            })
          );
          const orderedPermanentUrls = ch.imageOrder.map(
            (idx) => {
              var _a2, _b2;
              return ((_a2 = updatedImages[idx]) == null ? void 0 : _a2.permanentUrl) ?? ((_b2 = updatedImages[idx]) == null ? void 0 : _b2.preview) ?? "";
            }
          );
          const input = {
            title: ch.title || `Chapter ${ch.chapterNumber}`,
            chapterNumber: BigInt(ch.chapterNumber),
            images: orderedPermanentUrls,
            imageKeys: orderedPermanentUrls.filter(Boolean),
            imageOrder: ch.imageOrder.map((n) => BigInt(n)),
            comicId,
            creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous",
            chapterStatus: ChapterStatus.draft
          };
          if (!ch.backendId) {
            const chapId = await createChapterMutation.mutateAsync(input);
            return { ...ch, images: updatedImages, backendId: chapId };
          }
          await updateChapterMutation.mutateAsync({
            id: ch.backendId,
            input
          });
          return { ...ch, images: updatedImages };
        })
      );
      setChapters(updatedChapters);
      hasUnsavedRef.current = false;
      const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString();
      setSavedAt(ts);
      if (!silent)
        ue.success("Draft saved!", { description: `Saved at ${ts}` });
      return { comicId, updatedChapters };
    } catch (err) {
      if (!silent)
        ue.error(err instanceof Error ? err.message : "Save failed");
      return { comicId: null, updatedChapters: chapters };
    } finally {
      setIsSaving(false);
    }
  }
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    await doSaveDraft(false);
  };
  const handleOpenPublishConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PUBLISH: button clicked");
    if (!title.trim()) {
      ue.error("Please enter a title");
      return;
    }
    if (selectedGenres.length === 0) {
      ue.error("Select at least one genre");
      return;
    }
    if (chapters.length === 0) {
      ue.error("Add at least one chapter");
      return;
    }
    const empty = chapters.find((ch) => ch.images.length === 0);
    if (empty) {
      ue.error(
        `Chapter ${empty.chapterNumber} has no images. Upload at least one page.`
      );
      return;
    }
    const stillUploading = chapters.some(
      (ch) => ch.images.some((img) => img.uploadState === "uploading")
    );
    if (stillUploading) {
      ue.info("Please wait for uploads to finish before publishing.");
      return;
    }
    const hasErrors = chapters.some(
      (ch) => ch.images.some((img) => img.uploadState === "error")
    );
    if (hasErrors) {
      ue.error(
        'Some images failed to upload. Tap the red "!" indicator on the thumbnail to retry.'
      );
      return;
    }
    console.log("PUBLISH: validation passed — opening confirm dialog");
    setPublishConfirmOpen(true);
  };
  const handlePublishConfirm = async () => {
    if (isPublishingRef.current || isPublishing) {
      console.log("[Publish] Already publishing — ignoring duplicate call");
      return;
    }
    isPublishingRef.current = true;
    setIsPublishing(true);
    setPublishError(null);
    setUploadProgress({ done: 0, total: 0 });
    const failPublish = (step, err) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Publish] FAILED at "${step}":`, msg, err);
      setPublishError(`${step}
${msg}`);
      setIsPublishing(false);
      isPublishingRef.current = false;
      setUploadProgress({ done: 0, total: 0 });
    };
    console.log("[Publish] Starting publish…");
    try {
      console.log("[Publish] Step 1 — Validating fields…");
      if (!title.trim()) {
        failPublish("Validation", new Error("Please enter a comic title."));
        return;
      }
      if (chapters.length === 0) {
        failPublish("Validation", new Error("Add at least one chapter."));
        return;
      }
      const emptyChapter = chapters.find((ch) => ch.images.length === 0);
      if (emptyChapter) {
        failPublish(
          "Validation",
          new Error(`Chapter ${emptyChapter.chapterNumber} has no images.`)
        );
        return;
      }
      console.log("[Publish] Step 2 — Saving comic to backend…");
      let comicId = backendComicId;
      let finalCoverUrl = coverUrl;
      if (!finalCoverUrl || finalCoverUrl.startsWith("blob:")) {
        console.warn(
          "[Publish] Cover is a blob URL or missing — using placeholder."
        );
        finalCoverUrl = "/assets/generated/cover-lost-realm.dim_400x600.jpg";
        setCoverUrl(finalCoverUrl);
        setCoverPreview(finalCoverUrl);
      }
      const comicInput = {
        title: title.trim(),
        description: description.trim(),
        author: (currentUser == null ? void 0 : currentUser.username) ?? "Anonymous",
        coverUrl: finalCoverUrl || "/assets/generated/cover-lost-realm.dim_400x600.jpg",
        genres: selectedGenres,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        isPinned: false,
        ownerUploaded: false,
        creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous"
      };
      if (!comicId) {
        try {
          const newId = await createComicMutation.mutateAsync(comicInput);
          comicId = newId;
          setBackendComicId(newId);
          const localComic = {
            id: String(newId),
            backendId: newId,
            title: title.trim(),
            description: description.trim(),
            author: (currentUser == null ? void 0 : currentUser.username) ?? "Anonymous",
            coverImage: finalCoverUrl,
            genres: selectedGenres,
            status,
            likes: 0,
            views: 0,
            rating: 0,
            chapters: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isFeatured: false,
            isTrending: false,
            isPremium: false,
            isPinned: false,
            creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous",
            isOwnerComic: false
          };
          addComic(localComic);
          console.log(`[Publish] Comic created: backendId=${newId}`);
        } catch (e) {
          failPublish("Create comic in backend", e);
          return;
        }
      } else {
        try {
          await updateComicMutation.mutateAsync({
            id: comicId,
            input: comicInput
          });
          console.log(`[Publish] Comic updated: backendId=${comicId}`);
        } catch (e) {
          console.warn(
            "[Publish] Comic update failed — continuing with existing record.",
            e
          );
        }
      }
      console.log("[Publish] Step 3 — Confirming image uploads…");
      const totalImages = chapters.reduce(
        (sum, ch) => sum + ch.images.filter((img) => !img.permanentUrl).length,
        0
      );
      setUploadProgress({ done: 0, total: totalImages });
      let doneCount = 0;
      const chaptersWithUploads = [];
      for (let ci = 0; ci < chapters.length; ci++) {
        const ch = chapters[ci];
        let uploadedImages;
        try {
          uploadedImages = await uploadChapterImages(
            ch,
            ci,
            comicId,
            ch.backendId,
            doneCount,
            totalImages,
            (done) => {
              doneCount = done;
              setUploadProgress({ done, total: totalImages });
            }
          );
        } catch (e) {
          failPublish(`Upload images for Chapter ${ch.chapterNumber}`, e);
          return;
        }
        doneCount += ch.images.filter((img) => !img.permanentUrl).length;
        chaptersWithUploads.push({ ...ch, images: uploadedImages });
      }
      console.log(
        `[Publish] Image uploads confirmed (${totalImages} remaining at publish time)`
      );
      console.log("[Publish] Step 4 — Saving chapters to backend…");
      setUploadProgress({ done: 0, total: 0 });
      const savedChapters = [];
      for (const ch of chaptersWithUploads) {
        const dup = existingChapters == null ? void 0 : existingChapters.find(
          (ec) => Number(ec.chapterNumber) === ch.chapterNumber && (ch.backendId === null || ec.id !== ch.backendId)
        );
        if (dup) {
          console.warn(
            `[Publish] Duplicate chapter number ${ch.chapterNumber} — skipping.`
          );
          ue.warning(
            `Chapter ${ch.chapterNumber} number already taken — skipped.`
          );
          savedChapters.push(ch);
          continue;
        }
        const orderedUrls = ch.imageOrder.map(
          (idx) => {
            var _a2, _b2;
            return ((_a2 = ch.images[idx]) == null ? void 0 : _a2.permanentUrl) ?? ((_b2 = ch.images[idx]) == null ? void 0 : _b2.preview) ?? "";
          }
        );
        const input = {
          title: ch.title || `Chapter ${ch.chapterNumber}`,
          chapterNumber: BigInt(ch.chapterNumber),
          images: orderedUrls,
          imageKeys: orderedUrls.filter(Boolean),
          imageOrder: ch.imageOrder.map((n) => BigInt(n)),
          comicId,
          creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous",
          chapterStatus: ChapterStatus.draft
        };
        let chapterBackendId = ch.backendId;
        try {
          if (!chapterBackendId) {
            chapterBackendId = await createChapterMutation.mutateAsync(input);
            console.log(
              `[Publish] Chapter ${ch.chapterNumber} created: id=${chapterBackendId}`
            );
          } else {
            await updateChapterMutation.mutateAsync({
              id: chapterBackendId,
              input
            });
            console.log(
              `[Publish] Chapter ${ch.chapterNumber} updated: id=${chapterBackendId}`
            );
          }
        } catch (e) {
          failPublish(`Save Chapter ${ch.chapterNumber} to backend`, e);
          return;
        }
        if (!chapterBackendId) {
          failPublish(
            `Save Chapter ${ch.chapterNumber}`,
            new Error("Backend returned no chapter ID. Please try again.")
          );
          return;
        }
        savedChapters.push({ ...ch, backendId: chapterBackendId });
      }
      console.log("[Publish] Step 5 — Publishing chapters…");
      let firstPublishedId = null;
      let publishedCount = 0;
      const publishErrors = [];
      for (const ch of savedChapters) {
        if (!ch.backendId) {
          const idMissingMsg = `Chapter ${ch.chapterNumber} ID missing — please save as draft first, then publish.`;
          console.error("[Publish]", idMissingMsg);
          publishErrors.push(`Chapter ${ch.chapterNumber}: ${idMissingMsg}`);
          continue;
        }
        try {
          console.log(
            "PUBLISH: calling publishChapter for chapter",
            ch.backendId
          );
          await publishChapterMutation.mutateAsync(ch.backendId);
          if (!firstPublishedId) firstPublishedId = ch.backendId;
          publishedCount++;
          console.log(`[Publish] Chapter ${ch.chapterNumber} published ✓`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(
            `[Publish] Chapter ${ch.chapterNumber} FAILED:`,
            msg,
            e
          );
          publishErrors.push(`Chapter ${ch.chapterNumber}: ${msg}`);
        }
      }
      if (publishedCount === 0) {
        const detail = publishErrors.length > 0 ? publishErrors.join(" | ") : "No chapters were published — please try again.";
        failPublish("Publish chapters", new Error(detail));
        return;
      }
      if (publishErrors.length > 0) {
        console.warn(
          "[Publish] Partial success — some chapters failed:",
          publishErrors
        );
        ue.warning(
          `${publishedCount} published, ${publishErrors.length} failed.`
        );
      }
      console.log("[Publish] 🎉 Publish complete!");
      const finalChapters = savedChapters.map((ch) => ({
        ...ch,
        status: ch.backendId !== null ? "published" : ch.status
      }));
      for (const url of blobUrlsRef.current) {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      }
      blobUrlsRef.current = [];
      setChapters(finalChapters);
      hasUnsavedRef.current = false;
      const comicIdStr = comicId ? String(comicId) : null;
      const chapterIdStr = firstPublishedId ? String(firstPublishedId) : null;
      setPublishedComicId(comicIdStr);
      setPublishedChapterId(chapterIdStr);
      setPublishConfirmOpen(false);
      setPublishError(null);
      setPublishSuccessOpen(true);
      ue.success("Chapter published!", {
        description: `"${title}" is now live for all readers.`
      });
    } catch (err) {
      failPublish("Publish", err);
      return;
    }
    setIsPublishing(false);
    isPublishingRef.current = false;
    setUploadProgress({ done: 0, total: 0 });
  };
  const handleStitchedImages = (imageUrls) => {
    setChapters(
      (prev) => prev.map((ch, i) => {
        if (i !== stitchTargetChapter) return ch;
        const start = ch.images.length;
        const newEntries = imageUrls.map((url) => ({
          preview: url,
          file: null,
          // Stitcher returns permanent URLs from storage already
          permanentUrl: url.startsWith("blob:") ? null : url,
          uploadState: url.startsWith("blob:") ? "idle" : "done"
        }));
        return {
          ...ch,
          images: [...ch.images, ...newEntries],
          imageOrder: [
            ...ch.imageOrder,
            ...newEntries.map((_, j) => start + j)
          ]
        };
      })
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-10", "data-ocid": "create.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: existing ? "Edit Comic" : "Upload Your Comic" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: existing ? "Update your comic details and chapters" : "Share your story with the world" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 shrink-0", children: [
        existing && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full", children: "Editing" }),
        savedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "✓ Saved ",
          savedAt
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleOpenPublishConfirm,
        className: "space-y-8",
        "data-ocid": "create.form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[200px_1fr] gap-6 bg-card border border-border rounded-3xl p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold mb-2 block", children: "Cover Image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: "cover-file-input",
                  className: "flex flex-col items-center justify-center w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-border bg-muted/40 cursor-pointer hover:bg-muted/60 transition-smooth overflow-hidden",
                  "data-ocid": "create.cover_upload",
                  children: [
                    coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: coverPreview,
                        alt: "Cover preview",
                        className: "w-full h-full object-cover",
                        onError: () => setCoverPreview("")
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Upload cover" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-0.5", children: "or paste URL below" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "cover-file-input",
                        type: "file",
                        accept: "image/*",
                        className: "sr-only",
                        onChange: handleFileUpload
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: coverUrl,
                  onChange: (e) => {
                    setCoverUrl(e.target.value);
                    setCoverPreview(e.target.value);
                  },
                  placeholder: "Paste image URL...",
                  className: "rounded-xl mt-2 text-xs h-8",
                  "data-ocid": "create.cover_url_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "title",
                    className: "text-sm font-semibold mb-1.5 block",
                    children: "Title *"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "title",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Enter comic title...",
                    className: "rounded-xl",
                    "data-ocid": "create.title_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "desc",
                    className: "text-sm font-semibold mb-1.5 block",
                    children: "Description"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "desc",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "Describe your comic...",
                    rows: 4,
                    className: "rounded-xl resize-none",
                    "data-ocid": "create.description_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold mb-2 block", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusToggle, { value: status, onChange: setStatus })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold mb-3 block", children: [
              "Genres *",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground font-normal", children: "(select at least one)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ALL_GENRES.filter((g) => g !== "All").map((genre, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              GenreChip,
              {
                genre,
                isActive: selectedGenres.includes(genre),
                onClick: () => toggleGenre(genre),
                index: i
              },
              genre
            )) }),
            selectedGenres.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground self-center mr-1", children: "Selected:" }),
              selectedGenres.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "rounded-full text-xs gap-1",
                  children: [
                    g,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "hover:text-destructive transition-colors",
                        onClick: () => toggleGenre(g),
                        "data-ocid": `create.genre.remove.${g.toLowerCase().replace(/\s+/g, "_")}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                      }
                    )
                  ]
                },
                g
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-3xl p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChapterEditor,
            {
              chapters,
              isPublishing,
              onAdd: addChapterDraft,
              onRemove: removeChapterDraft,
              onChange: updateChapterField,
              onStitchImages: (i) => {
                setStitchTargetChapter(i);
                setStitchModalOpen(true);
              },
              onThumbnailDrop: handleThumbnailDrop,
              onImageUpload: handleImageUpload,
              onPreview: handlePreviewChapter,
              onRetryImageUpload: handleRetryImageUpload
            }
          ) }),
          existingChapters && existingChapters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-xl bg-muted/40 border border-border px-4 py-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              existingChapters.length,
              " chapter",
              existingChapters.length !== 1 ? "s" : "",
              " already saved to backend. Use unique chapter numbers to avoid duplicates."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 rounded-2xl py-5 text-sm font-semibold gap-2",
                onClick: handleSaveDraft,
                disabled: isSaving || isPublishing,
                "data-ocid": "create.save_draft_button",
                children: [
                  isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                  isSaving ? "Saving..." : "Save Draft"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 rounded-2xl py-5 text-sm font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/10",
                onClick: (e) => {
                  e.preventDefault();
                  handlePreviewChapter(0);
                },
                disabled: isSaving || isPublishing,
                "data-ocid": "create.preview_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                  " Preview"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                onClick: handleOpenPublishConfirm,
                className: "flex-[2] gradient-primary text-primary-foreground border-0 rounded-2xl py-5 text-base font-semibold shadow-glow gap-2",
                disabled: isSaving || isPublishing,
                style: { touchAction: "manipulation" },
                "data-ocid": "create.submit_button",
                children: [
                  isPublishing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5" }),
                  isPublishing ? "Publishing…" : existing ? "Publish Changes" : "Publish Comic"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageStitchingModal,
      {
        open: stitchModalOpen,
        onClose: () => setStitchModalOpen(false),
        onImagesUploaded: handleStitchedImages,
        chapterIndex: stitchTargetChapter
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PublishConfirmDialog,
      {
        open: publishConfirmOpen,
        onConfirm: handlePublishConfirm,
        onCancel: () => !isPublishing && setPublishConfirmOpen(false),
        isLoading: isPublishing,
        progress: uploadProgress,
        error: publishError,
        onDismissError: () => setPublishError(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChapterPreviewModal,
      {
        isOpen: previewOpen,
        onClose: () => setPreviewOpen(false),
        pages: ((_a = chapters[previewChapterIdx]) == null ? void 0 : _a.images.map((img) => img.preview)) ?? [],
        imageOrder: ((_b = chapters[previewChapterIdx]) == null ? void 0 : _b.imageOrder) ?? [],
        chapterTitle: ((_c = chapters[previewChapterIdx]) == null ? void 0 : _c.title) ?? "",
        chapterNumber: ((_d = chapters[previewChapterIdx]) == null ? void 0 : _d.chapterNumber) ?? 1
      }
    ),
    publishSuccessOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4",
        "data-ocid": "create.publish_success_dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-3xl p-7 max-w-sm w-full shadow-lg animate-scale-in text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-7 h-7 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-foreground mb-1", children: "Chapter Published! 🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
            "Chapter",
            " ",
            ((_e = chapters.find((ch) => ch.backendId !== null)) == null ? void 0 : _e.chapterNumber) ?? "",
            " ",
            "of ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: title }),
            " ",
            "is now live and visible to all users."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            publishedComicId && publishedChapterId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "w-full gradient-primary text-primary-foreground border-0 rounded-xl shadow-glow gap-2",
                onClick: () => {
                  setPublishSuccessOpen(false);
                  void navigate({
                    to: "/read/$comicId/$chapterId",
                    params: {
                      comicId: publishedComicId,
                      chapterId: publishedChapterId
                    }
                  });
                },
                "data-ocid": "create.view_chapter_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                  " View Chapter"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/10",
                onClick: () => {
                  setPublishSuccessOpen(false);
                  setChapters([
                    {
                      title: `Chapter ${chapters.length + 1}`,
                      images: [],
                      imageOrder: [],
                      orderLocked: false,
                      backendId: null,
                      chapterNumber: chapters.length + 1,
                      status: "draft"
                    }
                  ]);
                },
                "data-ocid": "create.upload_next_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  " Upload Next Chapter"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                className: "w-full rounded-xl text-sm text-muted-foreground",
                onClick: () => {
                  setPublishSuccessOpen(false);
                  void navigate({ to: "/creator-dashboard" });
                },
                "data-ocid": "create.go_dashboard_button",
                children: "Go to Dashboard"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  CreatePage as default
};
