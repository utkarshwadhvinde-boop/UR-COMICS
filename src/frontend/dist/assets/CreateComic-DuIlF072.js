import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, e as Button, h as useNavigate, i as useActor, o as useQueryClient, L as Link, R as RefreshCw, t as ExternalBlob, q as ue, m as createActor } from "./index-yTllSx9S.js";
import { U as Upload, P as Progress, C as CircleCheck, b as beginUpload, r as rollbackUpload, a as registerUploadedImage, c as commitUpload } from "./uploadService-fYyjAmU5.js";
import { E as Eye } from "./eye-pAWFObfA.js";
import { X } from "./x-s5adJLBT.js";
import { I as Input } from "./input-B8w6vewP.js";
import { L as Label } from "./label-Br_a15_J.js";
import { T as Textarea } from "./textarea-CSHcqIe3.js";
import { C as COMICS_QUERY_KEY } from "./useComics-C6OQouxy.js";
import { u as useGenres, F as FALLBACK_GENRES } from "./useGenres-B8IUG2E8.js";
import { C as ChevronLeft, c as createChapter } from "./chaptersService-CLqlZx2h.js";
import { c as createComic } from "./comicsService-DtcN4hqc.js";
import { I as ImagePlus } from "./image-plus-DCh4AV1H.js";
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function ChapterUploader({
  onImagesReady,
  maxImages = 50
}) {
  const [files, setFiles] = reactExports.useState([]);
  const [previews, setPreviews] = reactExports.useState([]);
  const [stretchMode, setStretchMode] = reactExports.useState(false);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const [previewMode, setPreviewMode] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const addFiles = reactExports.useCallback(
    (raw) => {
      const images = raw.filter((f) => f.type.startsWith("image/"));
      setFiles((prev) => {
        const combined = [...prev, ...images].slice(0, maxImages);
        setPreviews((prevUrls) => {
          const next = [...prevUrls];
          for (let i = prevUrls.length; i < combined.length; i++) {
            next.push(URL.createObjectURL(combined[i]));
          }
          return next;
        });
        return combined;
      });
    },
    [maxImages]
  );
  const removeFile = (index) => {
    setFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  };
  const handleFileInput = (e) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", "data-ocid": "chapter_uploader.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "aria-label": "Drop images here or click to select",
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        className: [
          "flex flex-col items-center justify-center gap-3 w-full py-12 rounded-xl border-2 border-dashed transition-colors duration-200 cursor-pointer",
          isDragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/60"
        ].join(" "),
        "data-ocid": "chapter_uploader.dropzone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-9 h-9 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm text-muted-foreground", children: "Drop images here or click to select" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground/60", children: "PNG · JPG · WebP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              className: "sr-only",
              onChange: handleFileInput,
              "data-ocid": "chapter_uploader.upload_button"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: files.length >= maxImages ? "text-destructive" : "text-foreground",
            children: files.length
          }
        ),
        " / ",
        maxImages,
        " pages"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setPreviewMode((v) => !v),
            className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-body border border-border bg-card text-muted-foreground hover:border-accent/60 hover:text-foreground transition-colors duration-150",
            "data-ocid": "chapter_uploader.preview_toggle",
            children: previewMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
              " Edit"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
              " Preview"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer select-none",
            "data-ocid": "chapter_uploader.stretch_toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: stretchMode,
                  onChange: (e) => setStretchMode(e.target.checked),
                  className: "sr-only"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "relative inline-block w-9 h-5 rounded-full transition-colors duration-200",
                    stretchMode ? "bg-accent" : "bg-muted"
                  ].join(" "),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: [
                        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                        stretchMode ? "translate-x-4" : ""
                      ].join(" ")
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-muted-foreground", children: "Seamless Stitch" })
            ]
          }
        )
      ] })
    ] }),
    files.length > 0 && previewMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1",
        "data-ocid": "chapter_uploader.preview_panel",
        children: files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative rounded-lg overflow-hidden",
            "data-ocid": `chapter_uploader.preview.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: previews[i],
                  alt: `Page ${i + 1}`,
                  className: "w-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded", children: [
                "Page ",
                i + 1
              ] })
            ]
          },
          `preview-${f.name}-${i}`
        ))
      }
    ),
    files.length > 0 && !previewMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: [
          "grid grid-cols-4 gap-2",
          stretchMode ? "gap-y-0" : ""
        ].join(" "),
        "data-ocid": "chapter_uploader.list",
        children: files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative group",
            "data-ocid": `chapter_uploader.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: previews[i],
                  alt: `Page ${i + 1}`,
                  className: [
                    "w-full object-cover rounded",
                    stretchMode ? "rounded-none" : "aspect-[3/4]"
                  ].join(" ")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Remove",
                  onClick: () => removeFile(i),
                  className: "absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                  "data-ocid": `chapter_uploader.remove.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1 rounded", children: i + 1 })
            ]
          },
          `${f.name}-${i}`
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        disabled: files.length === 0,
        onClick: () => onImagesReady(files),
        className: "w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40",
        "data-ocid": "chapter_uploader.next_button",
        children: "Next →"
      }
    )
  ] });
}
const CROP_W = 270;
const CROP_H = 480;
function ThumbnailCropper({
  file,
  onCrop,
  onCancel
}) {
  const canvasRef = reactExports.useRef(null);
  const [img, setImg] = reactExports.useState(null);
  const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
  const [scale, setScale] = reactExports.useState(1);
  const dragging = reactExports.useRef(false);
  const lastPos = reactExports.useRef({ x: 0, y: 0 });
  reactExports.useEffect(() => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const sc = Math.max(
        CROP_W / image.naturalWidth,
        CROP_H / image.naturalHeight
      );
      setScale(sc);
      setOffset({ x: 0, y: 0 });
      setImg(image);
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const clampOffset = reactExports.useCallback(
    (ox, oy, sc, image) => {
      const iw = image.naturalWidth * sc;
      const ih = image.naturalHeight * sc;
      const maxX = 0;
      const minX = CROP_W - iw;
      const maxY = 0;
      const minY = CROP_H - ih;
      return {
        x: Math.min(maxX, Math.max(minX, ox)),
        y: Math.min(maxY, Math.max(minY, oy))
      };
    },
    []
  );
  reactExports.useEffect(() => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const iw = img.naturalWidth * scale;
    const ih = img.naturalHeight * scale;
    ctx.clearRect(0, 0, CROP_W, CROP_H);
    ctx.drawImage(img, offset.x, offset.y, iw, ih);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, CROP_W, CROP_H);
    ctx.clearRect(0, 0, CROP_W, CROP_H);
    ctx.drawImage(img, offset.x, offset.y, iw, ih);
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CROP_W - 2, CROP_H - 2);
  }, [img, offset, scale]);
  const startDrag = (clientX, clientY) => {
    dragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };
  const moveDrag = (clientX, clientY) => {
    if (!dragging.current || !img) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };
    setOffset((prev) => clampOffset(prev.x + dx, prev.y + dy, scale, img));
  };
  const endDrag = () => {
    dragging.current = false;
  };
  const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
  const handleMouseMove = (e) => moveDrag(e.clientX, e.clientY);
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };
  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) onCrop(blob);
      },
      "image/jpeg",
      0.9
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground", children: "Drag to reposition · 9:16 crop" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "relative cursor-grab active:cursor-grabbing select-none",
        style: { width: CROP_W, height: CROP_H },
        "data-ocid": "thumbnail_cropper.canvas_target",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: CROP_W,
            height: CROP_H,
            className: "rounded-lg",
            style: { border: "2px solid #8B5CF6", display: "block" },
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: endDrag,
            onMouseLeave: endDrag,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: endDrag
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "thumbnail_cropper.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: handleCrop,
          disabled: !img,
          className: "bg-accent text-accent-foreground hover:bg-accent/90",
          "data-ocid": "thumbnail_cropper.submit_button",
          children: "Crop & Use"
        }
      )
    ] })
  ] });
}
const STEP_LABELS = ["Metadata", "Upload Pages", "Publishing", "Done"];
const MAX_RETRIES = 3;
function StepIndicator({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center gap-1 mb-8",
      "data-ocid": "create_comic.step_indicator",
      children: STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        const done = step < current;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 flex-1 last:flex-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: [
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-display border-2 transition-colors duration-200",
                      active ? "border-accent bg-accent text-accent-foreground" : done ? "border-accent/40 bg-accent/15 text-accent" : "border-border bg-card text-muted-foreground"
                    ].join(" "),
                    children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : step
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "text-[10px] font-body whitespace-nowrap",
                      active ? "text-accent" : "text-muted-foreground"
                    ].join(" "),
                    children: label
                  }
                )
              ] }),
              i < STEP_LABELS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: [
                    "flex-1 h-px mb-4 transition-colors duration-200",
                    done ? "bg-accent/40" : "bg-border"
                  ].join(" ")
                }
              )
            ]
          },
          step
        );
      })
    }
  );
}
function CreateComicPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { data: genres = FALLBACK_GENRES } = useGenres();
  const queryClient = useQueryClient();
  const [step, setStep] = reactExports.useState(1);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [coverFile, setCoverFile] = reactExports.useState(null);
  const [coverPreview, setCoverPreview] = reactExports.useState(null);
  const [croppingFile, setCroppingFile] = reactExports.useState(null);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [selectedGenres, setSelectedGenres] = reactExports.useState([]);
  const [comicId, setComicId] = reactExports.useState(null);
  const [chapterId, setChapterId] = reactExports.useState(null);
  const [stagedFiles, setStagedFiles] = reactExports.useState([]);
  const [uploadedCount, setUploadedCount] = reactExports.useState(0);
  const [uploadError, setUploadError] = reactExports.useState("");
  const cancelRef = reactExports.useRef(false);
  const [publishedComicId, setPublishedComicId] = reactExports.useState(null);
  const [publishedChapterId, setPublishedChapterId] = reactExports.useState(
    null
  );
  const handleCoverPick = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setCroppingFile(file);
  };
  const handleCropDone = (blob) => {
    const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
    setCoverFile(file);
    const url = URL.createObjectURL(blob);
    setCoverPreview(url);
    setCroppingFile(null);
  };
  const handleMetadataNext = async () => {
    if (!actor || !title.trim() || !coverFile) return;
    setIsCreating(true);
    try {
      const bytes = new Uint8Array(await coverFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const comic = await createComic(actor, {
        title: title.trim(),
        description: description.trim(),
        cover_blob: blob,
        genre_ids: selectedGenres
      });
      const chapter = await createChapter(actor, {
        comic_id: comic.id,
        title: "Chapter 1",
        number: 1
      });
      setComicId(comic.id);
      setChapterId(chapter.id);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      setStep(2);
    } catch {
      ue.error("Failed to create comic. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  const handleImagesReady = async (files) => {
    if (!actor || !chapterId || !comicId) return;
    setStagedFiles(files);
    setUploadedCount(0);
    setUploadError("");
    cancelRef.current = false;
    setStep(3);
    await runUpload(files, chapterId, comicId);
  };
  const runUpload = async (files, cid, comId) => {
    if (!actor) return;
    let rollbackTriggered = false;
    try {
      await beginUpload(actor, cid);
      for (let i = 0; i < files.length; i++) {
        if (cancelRef.current) {
          await rollbackUpload(actor, cid).catch(() => 0n);
          setUploadError(
            "Upload cancelled. Comic and chapter have been cleaned up."
          );
          setStep(4);
          return;
        }
        let attempt = 0;
        let success = false;
        while (attempt < MAX_RETRIES && !success && !cancelRef.current) {
          try {
            if (attempt > 0) {
              await new Promise((r) => setTimeout(r, 2 ** attempt * 1e3));
            }
            const bytes = new Uint8Array(await files[i].arrayBuffer());
            const blob = ExternalBlob.fromBytes(bytes);
            await registerUploadedImage(actor, cid, blob);
            setUploadedCount((c) => c + 1);
            success = true;
          } catch {
            attempt++;
          }
        }
        if (!success) {
          rollbackTriggered = true;
          const cleaned = await rollbackUpload(actor, cid).catch(() => 0n);
          setUploadError(
            `Image ${i + 1} failed after ${MAX_RETRIES} attempts. Cleaned up ${cleaned} orphaned file(s).`
          );
          setStep(4);
          return;
        }
      }
      const chapter = await commitUpload(actor, cid);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      setPublishedComicId(comId);
      setPublishedChapterId(chapter.id);
      setStep(4);
    } catch {
      if (!rollbackTriggered) {
        const cleaned = await rollbackUpload(actor, cid).catch(() => 0n);
        setUploadError(
          `Publish failed. Cleaned up ${cleaned} orphaned file(s). Please retry.`
        );
        setStep(4);
      }
    }
  };
  const handleRetry = async () => {
    if (!actor || !chapterId || !comicId || stagedFiles.length === 0) return;
    setUploadedCount(0);
    setUploadError("");
    cancelRef.current = false;
    setStep(3);
    await runUpload(stagedFiles, chapterId, comicId);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 sm:px-6 py-10",
      "data-ocid": "create_comic.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/creator",
            className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 font-body",
            "data-ocid": "create_comic.back_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Back to Dashboard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground mb-6", children: "New Comic" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step }),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", "data-ocid": "create_comic.step1", children: croppingFile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ThumbnailCropper,
          {
            file: croppingFile,
            onCrop: handleCropDone,
            onCancel: () => setCroppingFile(null)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Cover Image (9:16)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "cover",
                className: "relative flex items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border hover:border-accent/50 bg-card cursor-pointer transition-colors duration-200 overflow-hidden",
                "data-ocid": "create_comic.cover_dropzone",
                children: [
                  coverPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: coverPreview,
                      alt: "Cover preview",
                      className: "absolute inset-0 w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body", children: "Upload cover" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "cover",
                      type: "file",
                      accept: "image/*",
                      className: "sr-only",
                      onChange: handleCoverPick,
                      "data-ocid": "create_comic.cover_input"
                    }
                  )
                ]
              }
            ),
            coverFile && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-xs text-accent hover:underline w-fit font-body",
                onClick: () => setCroppingFile(coverFile),
                children: "Re-crop"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", className: "font-body text-sm", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                title.length,
                "/150"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                value: title,
                maxLength: 150,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "e.g. Shadow Protocol",
                required: true,
                className: "bg-card border-border font-body",
                "data-ocid": "create_comic.title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "font-body text-sm", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                description.length,
                "/1000"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                value: description,
                maxLength: 1e3,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "What is this comic about?",
                rows: 4,
                className: "bg-card border-border font-body resize-none",
                "data-ocid": "create_comic.description_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-2",
              "data-ocid": "create_comic.genres_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Genres" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Select one or more genres that best describe your comic." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-1", children: genres.map((genre) => {
                  const active = selectedGenres.includes(genre.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSelectedGenres(
                        (prev) => active ? prev.filter((id) => id !== genre.id) : [...prev, genre.id]
                      ),
                      className: [
                        "px-2 py-1.5 rounded-md text-xs font-body transition-colors duration-150 truncate",
                        active ? "bg-[#8B5CF6]/20 border border-[#8B5CF6] text-white" : "bg-card border border-border text-muted-foreground hover:border-[#8B5CF6]/50"
                      ].join(" "),
                      "data-ocid": `create_comic.genre_chip.${genre.slug}`,
                      children: genre.name
                    },
                    genre.id
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: isCreating || !title.trim() || !coverFile,
              onClick: handleMetadataNext,
              className: "bg-accent text-accent-foreground hover:bg-accent/90 w-full",
              "data-ocid": "create_comic.next_button",
              children: isCreating ? "Creating…" : "Next →"
            }
          )
        ] }) }),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "create_comic.step2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground mb-5", children: "Upload the pages for Chapter 1 — up to 50 images." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChapterUploader, { onImagesReady: handleImagesReady, maxImages: 50 })
        ] }),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", "data-ocid": "create_comic.step3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-foreground", children: "Publishing your chapter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-body text-sm text-muted-foreground",
                "data-ocid": "create_comic.loading_state",
                children: [
                  "Uploading ",
                  uploadedCount,
                  " / ",
                  stagedFiles.length,
                  " images…"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: stagedFiles.length > 0 ? uploadedCount / stagedFiles.length * 100 : 0,
              className: "h-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground text-center", children: "Do not close this page until the upload completes." })
        ] }),
        step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col items-center gap-6 py-10 text-center",
            "data-ocid": "create_comic.step4",
            children: !uploadError ? (
              // Success
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-11 h-11 text-accent" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-foreground", children: "🎉 Your comic is live!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm text-muted-foreground mt-2", children: [
                    stagedFiles.length,
                    " page",
                    stagedFiles.length !== 1 ? "s" : "",
                    " ",
                    "published successfully."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  publishedComicId && publishedChapterId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      onClick: () => navigate({
                        to: "/comics/$comicId/chapters/$chapterId",
                        params: {
                          comicId: publishedComicId,
                          chapterId: publishedChapterId
                        }
                      }),
                      className: "bg-accent text-accent-foreground hover:bg-accent/90",
                      "data-ocid": "create_comic.read_button",
                      children: "Read it"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => navigate({ to: "/creator" }),
                      "data-ocid": "create_comic.dashboard_button",
                      children: "Back to Dashboard"
                    }
                  )
                ] })
              ] })
            ) : (
              // Error
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "⚠️" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-foreground", children: "Upload failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-body text-sm text-muted-foreground mt-2 max-w-sm mx-auto",
                      "data-ocid": "create_comic.error_state",
                      children: uploadError
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      onClick: handleRetry,
                      disabled: stagedFiles.length === 0 || !chapterId,
                      className: "bg-accent text-accent-foreground hover:bg-accent/90",
                      "data-ocid": "create_comic.retry_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                        " Retry Upload"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => navigate({ to: "/creator" }),
                      "data-ocid": "create_comic.cancel_button",
                      children: "Cancel"
                    }
                  )
                ] })
              ] })
            )
          }
        )
      ]
    }
  );
}
export {
  CreateComicPage
};
