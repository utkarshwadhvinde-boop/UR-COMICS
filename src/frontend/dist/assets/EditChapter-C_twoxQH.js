import { c as createLucideIcon, e as useParams, g as useNavigate, k as useActor, m as useQueryClient, r as reactExports, j as jsxRuntimeExports, E as ErrorFallback, L as Link, d as Button, T as TriangleAlert, R as RefreshCw, i as LoaderCircle, p as ue, q as ExternalBlob, n as createActor } from "./index-DBVmmKIh.js";
import { T as Trash2, C as ConfirmModal } from "./ConfirmModal-bfE7m8c7.js";
import { B as Badge } from "./badge-4nQqznig.js";
import { I as Input } from "./input-BzqWAKa9.js";
import { L as Label } from "./label-DKvVgvPq.js";
import { C as CircleCheck, P as Progress, U as Upload, b as beginUpload, r as rollbackUpload, a as registerUploadedImage, c as commitUpload } from "./uploadService-Bmir3xQB.js";
import { S as Skeleton } from "./skeleton-CkgraJgd.js";
import { u as useChapter, c as chapterQueryKey } from "./useChapter-C_Beo5Wj.js";
import { c as chaptersQueryKey } from "./useChapters-DgAB5RZ_.js";
import { C as ChevronLeft, u as updateChapterDraft, d as deleteChapter } from "./chaptersService-CSOdR9Lz.js";
import { m as motion } from "./proxy-DJdLu_xi.js";
import { A as AnimatePresence } from "./index-CKRw5vBU.js";
import { X } from "./x-D2Z9ccJh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const MAX_RETRIES = 3;
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function EditChapterPage() {
  const { comicId, chapterId } = useParams({
    from: "/creator/comics/$comicId/chapters/$chapterId"
  });
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const {
    data: chapter,
    isLoading,
    isError,
    refetch
  } = useChapter(comicId, chapterId);
  const [title, setTitle] = reactExports.useState("");
  const [number, setNumber] = reactExports.useState("");
  const [stagedFiles, setStagedFiles] = reactExports.useState([]);
  const [uploadStage, setUploadStage] = reactExports.useState("idle");
  const [isSavingMeta, setIsSavingMeta] = reactExports.useState(false);
  const [showDeleteModal, setShowDeleteModal] = reactExports.useState(false);
  const [uploadedCount, setUploadedCount] = reactExports.useState(0);
  const [failedMessage, setFailedMessage] = reactExports.useState("");
  const cancelRef = reactExports.useRef(false);
  const fileInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
      setNumber(String(chapter.number));
    }
  }, [chapter]);
  const addFiles = reactExports.useCallback((rawFiles) => {
    const newFiles = rawFiles.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      status: "pending",
      progress: 0,
      retryLabel: ""
    }));
    setStagedFiles((prev) => [...prev, ...newFiles]);
  }, []);
  const handleFileSelect = (e) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/")
    );
    addFiles(droppedFiles);
  };
  const removeFile = (index) => {
    setStagedFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };
  const moveFile = (index, direction) => {
    setStagedFiles((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const handleSaveMeta = async (e) => {
    e.preventDefault();
    if (!actor || !chapter) return;
    setIsSavingMeta(true);
    try {
      await updateChapterDraft(actor, chapterId, {
        title: title.trim(),
        number: Number.parseFloat(number)
      });
      await queryClient.invalidateQueries({
        queryKey: chapterQueryKey(comicId, chapterId)
      });
      ue.success("Chapter info saved.");
    } catch {
      ue.error("Failed to save chapter info.");
    } finally {
      setIsSavingMeta(false);
    }
  };
  const handleUploadAndPublish = async () => {
    if (!actor || stagedFiles.length === 0) return;
    cancelRef.current = false;
    setUploadStage("uploading");
    setUploadedCount(0);
    let rollbackTriggered = false;
    try {
      await beginUpload(actor, chapterId);
      const workingFiles = stagedFiles.map((f) => ({ ...f }));
      for (let i = 0; i < workingFiles.length; i++) {
        if (cancelRef.current) {
          const cleaned = await rollbackUpload(actor, chapterId).catch(
            () => 0n
          );
          setStagedFiles([]);
          setUploadStage("idle");
          ue.info(
            `Upload cancelled. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`
          );
          return;
        }
        workingFiles[i] = {
          ...workingFiles[i],
          status: "uploading",
          retryLabel: ""
        };
        setStagedFiles([...workingFiles]);
        let attempt = 0;
        let success = false;
        while (attempt < MAX_RETRIES && !success && !cancelRef.current) {
          try {
            if (attempt > 0) {
              workingFiles[i] = {
                ...workingFiles[i],
                retryLabel: `Retrying attempt ${attempt}/${MAX_RETRIES - 1}...`
              };
              setStagedFiles([...workingFiles]);
              await new Promise((r) => setTimeout(r, 2 ** attempt * 1e3));
            }
            const bytes = new Uint8Array(
              await workingFiles[i].file.arrayBuffer()
            );
            const blob = ExternalBlob.fromBytes(bytes);
            const blobWithProgress = blob.withUploadProgress((pct) => {
              workingFiles[i] = {
                ...workingFiles[i],
                progress: pct,
                retryLabel: ""
              };
              setStagedFiles([...workingFiles]);
            });
            await registerUploadedImage(actor, chapterId, blobWithProgress);
            workingFiles[i] = {
              ...workingFiles[i],
              status: "done",
              progress: 100,
              retryLabel: ""
            };
            setStagedFiles([...workingFiles]);
            setUploadedCount((c) => c + 1);
            success = true;
          } catch {
            attempt++;
          }
        }
        if (!success) {
          workingFiles[i] = {
            ...workingFiles[i],
            status: "error",
            retryLabel: ""
          };
          setStagedFiles([...workingFiles]);
          rollbackTriggered = true;
          const cleaned = await rollbackUpload(actor, chapterId).catch(
            () => 0n
          );
          setFailedMessage(
            `Publish failed. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`
          );
          setUploadStage("failed");
          return;
        }
      }
      await commitUpload(actor, chapterId);
      await queryClient.invalidateQueries({
        queryKey: chapterQueryKey(comicId, chapterId)
      });
      await queryClient.invalidateQueries({
        queryKey: chaptersQueryKey(comicId)
      });
      setUploadStage("success");
    } catch {
      if (!rollbackTriggered) {
        const cleaned = await rollbackUpload(actor, chapterId).catch(() => 0n);
        setFailedMessage(
          `Publish failed. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`
        );
        setUploadStage("failed");
      }
    }
  };
  const handleCancel = () => {
    cancelRef.current = true;
  };
  const handleRetry = () => {
    setStagedFiles(
      (prev) => prev.map((f) => ({
        ...f,
        status: "pending",
        progress: 0,
        retryLabel: ""
      }))
    );
    setFailedMessage("");
    setUploadedCount(0);
    setUploadStage("idle");
  };
  const handleDelete = async () => {
    if (!actor) return;
    try {
      await deleteChapter(actor, chapterId);
      await queryClient.invalidateQueries({
        queryKey: chaptersQueryKey(comicId)
      });
      ue.success("Chapter deleted.");
      navigate({ to: "/creator/comics/$comicId", params: { comicId } });
    } catch {
      ue.error("Failed to delete chapter.");
    }
  };
  if (isError)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorFallback,
      {
        message: "Failed to load chapter.",
        onRetry: () => refetch()
      }
    );
  const isPublished = (chapter == null ? void 0 : chapter.is_published) ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 py-10",
      "data-ocid": "edit_chapter.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/creator/comics/$comicId",
            params: { comicId },
            className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 font-body",
            "data-ocid": "edit_chapter.back_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              " Back to Comic"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-48 bg-muted inline-block" }) : `Chapter ${chapter == null ? void 0 : chapter.number}${(chapter == null ? void 0 : chapter.title) ? ` — ${chapter.title}` : ""}` }),
            chapter && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: isPublished ? "default" : "secondary",
                className: "mt-2 text-xs",
                children: isPublished ? "Published" : "Draft"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => setShowDeleteModal(true),
              className: "text-muted-foreground hover:text-destructive",
              "data-ocid": "edit_chapter.delete_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1" }),
                " Delete"
              ]
            }
          )
        ] }),
        isPublished && chapter && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -6 },
              animate: { opacity: 1, y: 0 },
              className: "flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-8",
              "data-ocid": "edit_chapter.published_banner",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm text-green-300 flex-1", children: "This chapter is published and live for readers." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/comics/$comicId/chapters/$chapterId",
                    params: { comicId, chapterId },
                    className: "inline-flex items-center gap-1 text-xs font-body text-accent hover:text-accent/80 transition-colors duration-200",
                    "data-ocid": "edit_chapter.view_chapter_link",
                    children: [
                      "View Chapter ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" })
                    ]
                  }
                )
              ]
            }
          ),
          chapter.image_blobs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
              "data-ocid": "edit_chapter.published_grid",
              children: chapter.image_blobs.map((blob, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { delay: i * 0.03 },
                  className: "relative",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: blob.getDirectURL(),
                        alt: `Page ${i + 1}`,
                        className: "w-full aspect-[3/4] object-cover rounded-md border border-border",
                        loading: "lazy",
                        "data-ocid": `edit_chapter.published_images.item.${i + 1}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-mono px-1 rounded", children: i + 1 })
                  ]
                },
                blob.getDirectURL ? blob.getDirectURL() : `pub-${String(i)}`
              ))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-muted-foreground font-body text-sm",
              "data-ocid": "edit_chapter.published_images.empty_state",
              children: "No images in this published chapter."
            }
          )
        ] }),
        !isPublished && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveMeta, className: "flex flex-col gap-5 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "number", className: "font-body text-sm", children: "Chapter Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "number",
                    type: "number",
                    step: "0.1",
                    min: "0",
                    value: number,
                    onChange: (e) => setNumber(e.target.value),
                    className: "bg-card border-border font-mono",
                    "data-ocid": "edit_chapter.number_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "title", className: "font-body text-sm", children: "Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "title",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "bg-card border-border font-body",
                    "data-ocid": "edit_chapter.title_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                variant: "outline",
                disabled: isSavingMeta || uploadStage === "uploading",
                className: "w-fit",
                "data-ocid": "edit_chapter.save_meta_button",
                children: isSavingMeta ? "Saving..." : "Save Info"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "border border-border rounded-xl p-6 bg-card",
              "data-ocid": "edit_chapter.upload_panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
                uploadStage === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0 },
                    className: "flex flex-col items-center gap-4 py-12 text-center",
                    "data-ocid": "edit_chapter.success_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-9 h-9 text-green-400" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl text-foreground", children: [
                          "Chapter ",
                          chapter == null ? void 0 : chapter.number,
                          " Published!"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm text-muted-foreground mt-1", children: [
                          stagedFiles.length,
                          " image",
                          stagedFiles.length !== 1 ? "s" : "",
                          " are now live for readers."
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Link,
                        {
                          to: "/comics/$comicId/chapters/$chapterId",
                          params: { comicId, chapterId },
                          className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-body hover:bg-accent/90 transition-colors duration-200",
                          "data-ocid": "edit_chapter.view_chapter_link",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
                            " View Chapter"
                          ]
                        }
                      )
                    ]
                  },
                  "success"
                ),
                uploadStage === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0 },
                    className: "flex flex-col gap-4",
                    "data-ocid": "edit_chapter.error_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-destructive flex-1", children: failedMessage })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          variant: "outline",
                          onClick: handleRetry,
                          className: "w-fit",
                          "data-ocid": "edit_chapter.retry_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                            " Retry Upload"
                          ]
                        }
                      )
                    ]
                  },
                  "failed"
                ),
                uploadStage === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: "flex flex-col gap-4",
                    "data-ocid": "edit_chapter.loading_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-sm text-foreground", children: [
                          "Uploading ",
                          uploadedCount,
                          " of ",
                          stagedFiles.length,
                          " ",
                          "images..."
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            type: "button",
                            variant: "ghost",
                            size: "sm",
                            onClick: handleCancel,
                            className: "text-muted-foreground hover:text-destructive text-xs",
                            "data-ocid": "edit_chapter.cancel_button",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5 mr-1" }),
                              " Cancel"
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 mt-1", children: stagedFiles.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-border",
                          "data-ocid": `edit_chapter.upload_files.item.${i + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: f.preview,
                                alt: `Page ${i + 1}`,
                                className: "w-8 h-11 object-cover rounded flex-shrink-0"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground truncate", children: f.file.name }),
                              f.retryLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-accent font-body mt-0.5", children: f.retryLabel }),
                              f.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  className: "h-full bg-accent",
                                  animate: { width: `${f.progress}%` },
                                  transition: { duration: 0.2 }
                                }
                              ) })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0", children: [
                              f.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Waiting" }),
                              f.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-accent" }),
                              f.status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-green-400" }),
                              f.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-destructive" })
                            ] })
                          ]
                        },
                        `up-${f.file.name}-${i}`
                      )) })
                    ]
                  },
                  "uploading"
                ),
                uploadStage === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    className: "flex flex-col gap-5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-foreground mb-1", children: "Upload Images" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Images upload in DRAFT state. All must succeed before publishing. Any failure triggers automatic rollback." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onDragOver: handleDragOver,
                          onDrop: handleDrop,
                          onClick: () => {
                            var _a;
                            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                          },
                          onKeyDown: (e) => {
                            var _a;
                            return e.key === "Enter" && ((_a = fileInputRef.current) == null ? void 0 : _a.click());
                          },
                          className: "flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border hover:border-accent/60 rounded-lg py-10 cursor-pointer transition-colors duration-200 w-full",
                          "data-ocid": "edit_chapter.dropzone",
                          "aria-label": "Drop images here or click to browse",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-muted-foreground" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-muted-foreground", children: "Drop images here or click to browse" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground/60", children: "PNG · JPG · WebP" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                ref: fileInputRef,
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                className: "sr-only",
                                onChange: handleFileSelect,
                                "data-ocid": "edit_chapter.upload_button"
                              }
                            )
                          ]
                        }
                      ),
                      stagedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex flex-col gap-2",
                          "data-ocid": "edit_chapter.staged_list",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-body text-muted-foreground", children: [
                              stagedFiles.length,
                              " file",
                              stagedFiles.length !== 1 ? "s" : "",
                              " staged"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: stagedFiles.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              motion.div,
                              {
                                initial: { opacity: 0, x: -10 },
                                animate: { opacity: 1, x: 0 },
                                exit: { opacity: 0, x: 10 },
                                transition: { duration: 0.18 },
                                className: "flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border",
                                "data-ocid": `edit_chapter.staged_files.item.${i + 1}`,
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "img",
                                    {
                                      src: f.preview,
                                      alt: `Page ${i + 1}`,
                                      className: "w-9 h-12 object-cover rounded flex-shrink-0"
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground truncate", children: f.file.name }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-body", children: formatBytes(f.file.size) })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => moveFile(i, "up"),
                                        disabled: i === 0,
                                        "aria-label": "Move up",
                                        className: "p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors duration-150",
                                        "data-ocid": `edit_chapter.move_up.${i + 1}`,
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3.5 h-3.5" })
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => moveFile(i, "down"),
                                        disabled: i === stagedFiles.length - 1,
                                        "aria-label": "Move down",
                                        className: "p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors duration-150",
                                        "data-ocid": `edit_chapter.move_down.${i + 1}`,
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3.5 h-3.5" })
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: () => removeFile(i),
                                        "aria-label": "Remove file",
                                        className: "p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors duration-150",
                                        "data-ocid": `edit_chapter.remove_file.${i + 1}`,
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                                      }
                                    )
                                  ] })
                                ]
                              },
                              `staged-${f.file.name}-${i}`
                            )) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          disabled: stagedFiles.length === 0,
                          onClick: handleUploadAndPublish,
                          className: "w-full bg-accent text-accent-foreground hover:bg-accent/90",
                          "data-ocid": "edit_chapter.publish_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2" }),
                            "Upload & Publish",
                            stagedFiles.length > 0 ? ` (${stagedFiles.length} image${stagedFiles.length !== 1 ? "s" : ""})` : ""
                          ]
                        }
                      )
                    ]
                  },
                  "idle"
                )
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmModal,
          {
            open: showDeleteModal,
            title: "Delete chapter?",
            description: "This will permanently delete this chapter and all its images. This cannot be undone.",
            confirmLabel: "Delete Chapter",
            onConfirm: handleDelete,
            onCancel: () => setShowDeleteModal(false),
            destructive: true
          }
        )
      ]
    }
  );
}
export {
  EditChapterPage
};
