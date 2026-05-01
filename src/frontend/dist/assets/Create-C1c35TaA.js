import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X, a as Button, U as Upload, i as useNavigate, o as useSearch, u as useAppStore, b as Badge, I as Input, B as BookOpen } from "./index-BgVxhZ2x.js";
import { A as ALL_GENRES, G as GenreChip } from "./GenreChip-B8hw_Zr4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CK3Mijd_.js";
import { u as ue } from "./index-5IwcxvLb.js";
import { C as CircleCheck } from "./circle-check-CQOhgZnJ.js";
import { L as Label } from "./label-BOuQaJiZ.js";
import { T as Textarea } from "./textarea-CtjtaN0a.js";
import { P as Plus } from "./plus-_OKKqmu9.js";
import "./index-DzUsK6bF.js";
import "./index-ClD3NfkI.js";
import "./index-Z3-QW_0S.js";
import "./index-BHTFg43G.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
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
const Layers = createLucideIcon("layers", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
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
function ImageStitchingModal({
  open,
  onClose,
  onImagesUploaded,
  chapterIndex
}) {
  const [state, setState] = reactExports.useState("idle");
  const [images, setImages] = reactExports.useState([]);
  const [stitchedUrl, setStitchedUrl] = reactExports.useState(null);
  const [stitchedBlob, setStitchedBlob] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [progressLabel, setProgressLabel] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const [dragIndex, setDragIndex] = reactExports.useState(null);
  const [dragOverIndex, setDragOverIndex] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const touchDragIndex = reactExports.useRef(null);
  const touchStartY = reactExports.useRef(0);
  const itemHeight = reactExports.useRef(0);
  const handleReset = () => {
    for (const img of images) URL.revokeObjectURL(img.previewUrl);
    if (stitchedUrl) URL.revokeObjectURL(stitchedUrl);
    setImages([]);
    setStitchedUrl(null);
    setStitchedBlob(null);
    setProgress(0);
    setProgressLabel("");
    setError(null);
    setDragIndex(null);
    setDragOverIndex(null);
    setState("idle");
  };
  const handleClose = () => {
    handleReset();
    onClose();
  };
  const addFiles = reactExports.useCallback((files) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    const newItems = imageFiles.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));
    setImages((prev) => {
      const updated = [...prev, ...newItems];
      if (updated.length > 0) setState("reordering");
      return updated;
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
  const removeImage = (id) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      const next = prev.filter((img) => img.id !== id);
      if (next.length === 0) setState("idle");
      return next;
    });
  };
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleTouchStart = (e, index) => {
    touchDragIndex.current = index;
    touchStartY.current = e.touches[0].clientY;
    const el = e.currentTarget;
    itemHeight.current = el.getBoundingClientRect().height;
  };
  const handleTouchMove = (e) => {
    if (touchDragIndex.current === null) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const steps = Math.round(deltaY / (itemHeight.current || 80));
    const newIndex = Math.max(
      0,
      Math.min(images.length - 1, touchDragIndex.current + steps)
    );
    setDragOverIndex(newIndex);
  };
  const handleTouchEnd = () => {
    if (touchDragIndex.current !== null && dragOverIndex !== null && touchDragIndex.current !== dragOverIndex) {
      const from = touchDragIndex.current;
      const to = dragOverIndex;
      setImages((prev) => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }
    touchDragIndex.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const stitchImages = async () => {
    if (images.length === 0) return;
    setState("stitching");
    setProgress(0);
    setError(null);
    try {
      const loaded = await Promise.all(
        images.map(
          (item, i) => new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              setProgress(Math.round((i + 1) / images.length * 40));
              setProgressLabel(`Loading image ${i + 1}/${images.length}...`);
              resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image ${i + 1}`));
            img.src = item.previewUrl;
          })
        )
      );
      const maxWidth = Math.max(...loaded.map((img) => img.naturalWidth));
      const totalHeight = loaded.reduce((sum, img) => {
        const scale = maxWidth / img.naturalWidth;
        return sum + Math.round(img.naturalHeight * scale);
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
        const scale = maxWidth / img.naturalWidth;
        const drawHeight = Math.round(img.naturalHeight * scale);
        ctx.drawImage(img, 0, yOffset, maxWidth, drawHeight);
        yOffset += drawHeight;
        const pct = 40 + Math.round((i + 1) / loaded.length * 50);
        setProgress(pct);
        setProgressLabel(`Stitching panel ${i + 1}/${loaded.length}...`);
        await new Promise((r) => setTimeout(r, 0));
      }
      setProgress(95);
      setProgressLabel("Finalizing...");
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error("Canvas export failed")),
          "image/jpeg",
          0.92
        );
      });
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
          images.length > 0 && !isStitching && !isPreview && !isDone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
              images.length,
              " image",
              images.length !== 1 ? "s" : ""
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
          isReordering && images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "stitch.image_list", children: images.map((img, index) => {
            const isActive = dragIndex === index;
            const isOver = dragOverIndex === index && dragIndex !== index;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                draggable: true,
                onDragStart: (e) => handleDragStart(e, index),
                onDragOver: (e) => handleDragOver(e, index),
                onDrop: (e) => handleDrop(e, index),
                onDragEnd: handleDragEnd,
                onTouchStart: (e) => handleTouchStart(e, index),
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
                className: `flex items-center gap-3 rounded-xl border p-2 transition-smooth cursor-grab active:cursor-grabbing ${isActive ? "drag-item-active border-primary/50 bg-primary/10 shadow-glow" : isOver ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/20"}`,
                "data-ocid": `stitch.image_item.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: img.previewUrl,
                      alt: `Panel ${index + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground truncate", children: [
                      "Panel ",
                      index + 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: img.file.name })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeImage(img.id),
                      className: "w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth shrink-0",
                      "aria-label": `Remove panel ${index + 1}`,
                      "data-ocid": `stitch.remove_image_button.${index + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              },
              img.id
            );
          }) }),
          isStitching && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 space-y-5", "data-ocid": "stitch.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: images.slice(0, 6).map((img) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "aspect-[3/4] rounded-lg overflow-hidden bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: img.previewUrl,
                    alt: "",
                    className: "w-full h-full object-cover"
                  }
                )
              },
              img.id
            )) }),
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
                      images.length,
                      " panels merged into one page"
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "aspect-[3/4] rounded-lg overflow-hidden bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: img.previewUrl,
                    alt: `Panel ${i + 1}`,
                    className: "w-full h-full object-cover"
                  }
                )
              },
              img.id
            )) }),
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
          isReordering && images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
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
                  images.length,
                  " Panel",
                  images.length !== 1 ? "s" : ""
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
function ChapterEditor({
  chapters,
  onAdd,
  onRemove,
  onChange,
  onStitchImages
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: ch.title,
                    onClick: (e) => e.stopPropagation(),
                    onChange: (e) => onChange(i, "title", e.target.value),
                    placeholder: `Chapter ${i + 1} title`,
                    className: "rounded-lg h-8 text-sm border-0 bg-transparent focus-visible:ring-1 px-2",
                    "data-ocid": `create.chapter.title_input.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: expanded === i ? "▲" : "▼" }),
                  chapters.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        onRemove(i);
                      },
                      className: "ml-1 text-muted-foreground hover:text-destructive transition-colors",
                      "data-ocid": `create.chapter.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            }
          ),
          expanded === i && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 border-t border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mt-3 mb-1.5 block", children: "Chapter Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: ch.content,
                onChange: (e) => onChange(i, "content", e.target.value),
                placeholder: "Write chapter content, paste image URLs (one per line), or describe the chapter...",
                rows: 6,
                className: "rounded-xl resize-none text-sm",
                "data-ocid": `create.chapter.content_textarea.${i + 1}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Tip: Paste one image URL per line, or use Stitch Images to merge panels." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10 hover:text-primary shrink-0 ml-3",
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
        ]
      },
      ch.title + String(i)
    )) })
  ] });
}
function CreatePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const editId = search == null ? void 0 : search.edit;
  const { currentUser, comics, addComic, updateComic } = useAppStore();
  const existing = editId ? comics.find((c) => c.id === editId) : null;
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
    (existing == null ? void 0 : existing.chapters.map((ch) => ({
      title: ch.title,
      content: ch.pages.join("\n")
    }))) ?? [{ title: "Chapter 1", content: "" }]
  );
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [stitchModalOpen, setStitchModalOpen] = reactExports.useState(false);
  const [stitchTargetChapter, setStitchTargetChapter] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setSelectedGenres(existing.genres);
      setCoverUrl(existing.coverImage);
      setCoverPreview(existing.coverImage);
      setStatus(existing.status);
      setChapters(
        existing.chapters.map((ch) => ({
          title: ch.title,
          content: ch.pages.join("\n")
        }))
      );
    }
  }, [existing]);
  const toggleGenre = (genre) => {
    if (genre === "All") return;
    setSelectedGenres(
      (prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };
  const handleFileUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setCoverUrl(url);
  };
  const handleCoverUrlChange = (url) => {
    setCoverUrl(url);
    setCoverPreview(url);
  };
  const addChapter = () => setChapters((prev) => [
    ...prev,
    { title: `Chapter ${prev.length + 1}`, content: "" }
  ]);
  const removeChapter = (idx) => setChapters((prev) => prev.filter((_, i) => i !== idx));
  const updateChapter = (i, field, val) => setChapters(
    (prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c)
  );
  const handleSubmit = (e, publishNow = true) => {
    e.preventDefault();
    if (!title.trim()) {
      ue.error("Please enter a title");
      return;
    }
    if (selectedGenres.length === 0) {
      ue.error("Select at least one genre");
      return;
    }
    if (publishNow && chapters.length === 0) {
      ue.error("Add at least one chapter to publish");
      return;
    }
    setIsSubmitting(true);
    const comicId = (existing == null ? void 0 : existing.id) ?? `comic-${Date.now()}`;
    const newChapters = chapters.map((ch, i) => {
      var _a, _b;
      return {
        id: `${comicId}-ch${i + 1}`,
        comicId,
        title: ch.title || `Chapter ${i + 1}`,
        chapterNumber: i + 1,
        pages: ch.content ? ch.content.split("\n").map((l) => l.trim()).filter(Boolean) : [],
        createdAt: ((_a = existing == null ? void 0 : existing.chapters[i]) == null ? void 0 : _a.createdAt) ?? Date.now(),
        updatedAt: Date.now(),
        isPremium: false,
        coinCost: 0,
        views: ((_b = existing == null ? void 0 : existing.chapters[i]) == null ? void 0 : _b.views) ?? 0
      };
    });
    const finalCover = coverPreview || (existing == null ? void 0 : existing.coverImage) || "/assets/generated/cover-lost-realm.dim_400x600.jpg";
    if (existing) {
      updateComic(comicId, {
        title: title.trim(),
        description: description.trim(),
        genres: selectedGenres,
        coverImage: finalCover,
        status,
        chapters: newChapters,
        updatedAt: Date.now()
      });
      setTimeout(() => {
        setIsSubmitting(false);
        ue.success("Comic updated!");
        void navigate({ to: "/creator-dashboard" });
      }, 600);
    } else {
      const newComic = {
        id: comicId,
        title: title.trim(),
        description: description.trim(),
        author: (currentUser == null ? void 0 : currentUser.username) ?? "Anonymous",
        coverImage: finalCover,
        genres: selectedGenres,
        status,
        likes: 0,
        views: 0,
        rating: 0,
        chapters: newChapters,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFeatured: false,
        isTrending: false,
        isPremium: false,
        isPinned: false,
        creatorId: (currentUser == null ? void 0 : currentUser.id) ?? "anonymous",
        isOwnerComic: false
      };
      addComic(newComic);
      setTimeout(() => {
        setIsSubmitting(false);
        ue.success("Comic published!");
        void navigate({ to: "/creator-dashboard" });
      }, 800);
    }
  };
  const handleSaveDraft = (e) => handleSubmit(e, false);
  const handleOpenStitch = (chapterIndex) => {
    setStitchTargetChapter(chapterIndex);
    setStitchModalOpen(true);
  };
  const handleStitchedImages = (imageUrls) => {
    var _a;
    const existing2 = ((_a = chapters[stitchTargetChapter]) == null ? void 0 : _a.content) ?? "";
    const newContent = existing2 ? `${existing2}
${imageUrls.join("\n")}` : imageUrls.join("\n");
    updateChapter(stitchTargetChapter, "content", newContent);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-10", "data-ocid": "create.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: existing ? "Edit Comic" : "Upload Your Comic" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: existing ? "Update your comic details and chapters" : "Share your story with the world" })
      ] }),
      existing && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full mt-1 shrink-0", children: "Editing" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => handleSubmit(e, true),
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
                  onChange: (e) => handleCoverUrlChange(e.target.value),
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
              onAdd: addChapter,
              onRemove: removeChapter,
              onChange: updateChapter,
              onStitchImages: handleOpenStitch
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 rounded-2xl py-5 text-sm font-semibold gap-2",
                onClick: handleSaveDraft,
                disabled: isSubmitting,
                "data-ocid": "create.save_draft_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                  " Save Draft"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-[2] gradient-primary text-primary-foreground border-0 rounded-2xl py-5 text-base font-semibold shadow-glow gap-2",
                disabled: isSubmitting,
                "data-ocid": "create.submit_button",
                children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" }),
                  existing ? "Saving..." : "Publishing..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-5 h-5" }),
                  existing ? "Save Changes" : "Publish Comic"
                ] })
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
    )
  ] });
}
export {
  CreatePage as default
};
