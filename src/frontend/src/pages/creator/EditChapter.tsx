import { ExternalBlob, createActor } from "@/backend";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { chapterQueryKey, useChapter } from "@/hooks/useChapter";
import { chaptersQueryKey } from "@/hooks/useChapters";
import { deleteChapter, updateChapterDraft } from "@/services/chaptersService";
import {
  beginUpload,
  commitUpload,
  registerUploadedImage,
  rollbackUpload,
} from "@/services/uploadService";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Send,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type FileStatus = "pending" | "uploading" | "done" | "error";

type UploadFileState = {
  file: File;
  preview: string;
  status: FileStatus;
  progress: number;
  retryLabel: string;
};

type UploadStage = "idle" | "uploading" | "success" | "failed";

const MAX_RETRIES = 3;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EditChapterPage() {
  const { comicId, chapterId } = useParams({
    from: "/creator/comics/$comicId/chapters/$chapterId",
  });
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const {
    data: chapter,
    isLoading,
    isError,
    refetch,
  } = useChapter(comicId, chapterId);

  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [stagedFiles, setStagedFiles] = useState<UploadFileState[]>([]);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedMessage, setFailedMessage] = useState("");
  const cancelRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title);
      setNumber(String(chapter.number));
    }
  }, [chapter]);

  const addFiles = useCallback((rawFiles: File[]) => {
    const newFiles: UploadFileState[] = rawFiles.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      status: "pending",
      progress: 0,
      retryLabel: "",
    }));
    setStagedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    addFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    setStagedFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setStagedFiles((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !chapter) return;
    setIsSavingMeta(true);
    try {
      await updateChapterDraft(actor, chapterId, {
        title: title.trim(),
        number: Number.parseFloat(number),
      });
      await queryClient.invalidateQueries({
        queryKey: chapterQueryKey(comicId, chapterId),
      });
      toast.success("Chapter info saved.");
    } catch {
      toast.error("Failed to save chapter info.");
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
            () => 0n,
          );
          setStagedFiles([]);
          setUploadStage("idle");
          toast.info(
            `Upload cancelled. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`,
          );
          return;
        }

        workingFiles[i] = {
          ...workingFiles[i],
          status: "uploading",
          retryLabel: "",
        };
        setStagedFiles([...workingFiles]);

        let attempt = 0;
        let success = false;

        while (attempt < MAX_RETRIES && !success && !cancelRef.current) {
          try {
            if (attempt > 0) {
              workingFiles[i] = {
                ...workingFiles[i],
                retryLabel: `Retrying attempt ${attempt}/${MAX_RETRIES - 1}...`,
              };
              setStagedFiles([...workingFiles]);
              await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
            }

            const bytes = new Uint8Array(
              await workingFiles[i].file.arrayBuffer(),
            );
            const blob = ExternalBlob.fromBytes(bytes);
            const blobWithProgress = blob.withUploadProgress((pct) => {
              workingFiles[i] = {
                ...workingFiles[i],
                progress: pct,
                retryLabel: "",
              };
              setStagedFiles([...workingFiles]);
            });
            await registerUploadedImage(actor, chapterId, blobWithProgress);
            workingFiles[i] = {
              ...workingFiles[i],
              status: "done",
              progress: 100,
              retryLabel: "",
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
            retryLabel: "",
          };
          setStagedFiles([...workingFiles]);
          rollbackTriggered = true;
          const cleaned = await rollbackUpload(actor, chapterId).catch(
            () => 0n,
          );
          setFailedMessage(
            `Publish failed. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`,
          );
          setUploadStage("failed");
          return;
        }
      }

      // All files uploaded — commit
      await commitUpload(actor, chapterId);
      await queryClient.invalidateQueries({
        queryKey: chapterQueryKey(comicId, chapterId),
      });
      await queryClient.invalidateQueries({
        queryKey: chaptersQueryKey(comicId),
      });
      setUploadStage("success");
    } catch {
      if (!rollbackTriggered) {
        const cleaned = await rollbackUpload(actor, chapterId).catch(() => 0n);
        setFailedMessage(
          `Publish failed. Cleaned up ${cleaned} orphaned file(s). Chapter reverted to Draft.`,
        );
        setUploadStage("failed");
      }
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  const handleRetry = () => {
    setStagedFiles((prev) =>
      prev.map((f) => ({
        ...f,
        status: "pending" as FileStatus,
        progress: 0,
        retryLabel: "",
      })),
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
        queryKey: chaptersQueryKey(comicId),
      });
      toast.success("Chapter deleted.");
      navigate({ to: "/creator/comics/$comicId", params: { comicId } });
    } catch {
      toast.error("Failed to delete chapter.");
    }
  };

  if (isError)
    return (
      <ErrorFallback
        message="Failed to load chapter."
        onRetry={() => refetch()}
      />
    );

  const isPublished = chapter?.is_published ?? false;

  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="edit_chapter.page"
    >
      <Link
        to="/creator/comics/$comicId"
        params={{ comicId }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 font-body"
        data-ocid="edit_chapter.back_link"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Comic
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            {isLoading ? (
              <Skeleton className="h-9 w-48 bg-muted inline-block" />
            ) : (
              `Chapter ${chapter?.number}${chapter?.title ? ` — ${chapter.title}` : ""}`
            )}
          </h1>
          {chapter && (
            <Badge
              variant={isPublished ? "default" : "secondary"}
              className="mt-2 text-xs"
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          className="text-muted-foreground hover:text-destructive"
          data-ocid="edit_chapter.delete_button"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </div>

      {/* --- PUBLISHED VIEW --- */}
      {isPublished && chapter && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-8"
            data-ocid="edit_chapter.published_banner"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="font-body text-sm text-green-300 flex-1">
              This chapter is published and live for readers.
            </span>
            <Link
              to="/comics/$comicId/chapters/$chapterId"
              params={{ comicId, chapterId }}
              className="inline-flex items-center gap-1 text-xs font-body text-accent hover:text-accent/80 transition-colors duration-200"
              data-ocid="edit_chapter.view_chapter_link"
            >
              View Chapter <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>

          {chapter.image_blobs.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              data-ocid="edit_chapter.published_grid"
            >
              {chapter.image_blobs.map((blob, i) => (
                <motion.div
                  key={
                    blob.getDirectURL ? blob.getDirectURL() : `pub-${String(i)}`
                  }
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative"
                >
                  <img
                    src={blob.getDirectURL()}
                    alt={`Page ${i + 1}`}
                    className="w-full aspect-[3/4] object-cover rounded-md border border-border"
                    loading="lazy"
                    data-ocid={`edit_chapter.published_images.item.${i + 1}`}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-mono px-1 rounded">
                    {i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p
              className="text-muted-foreground font-body text-sm"
              data-ocid="edit_chapter.published_images.empty_state"
            >
              No images in this published chapter.
            </p>
          )}
        </>
      )}

      {/* --- DRAFT VIEW --- */}
      {!isPublished && (
        <>
          {/* Meta form */}
          <form onSubmit={handleSaveMeta} className="flex flex-col gap-5 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="number" className="font-body text-sm">
                  Chapter Number
                </Label>
                <Input
                  id="number"
                  type="number"
                  step="0.1"
                  min="0"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="bg-card border-border font-mono"
                  data-ocid="edit_chapter.number_input"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="font-body text-sm">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-card border-border font-body"
                  data-ocid="edit_chapter.title_input"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={isSavingMeta || uploadStage === "uploading"}
              className="w-fit"
              data-ocid="edit_chapter.save_meta_button"
            >
              {isSavingMeta ? "Saving..." : "Save Info"}
            </Button>
          </form>

          {/* Upload panel */}
          <div
            className="border border-border rounded-xl p-6 bg-card"
            data-ocid="edit_chapter.upload_panel"
          >
            <AnimatePresence mode="wait">
              {/* SUCCESS */}
              {uploadStage === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-12 text-center"
                  data-ocid="edit_chapter.success_state"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-green-400" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-foreground">
                      Chapter {chapter?.number} Published!
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      {stagedFiles.length} image
                      {stagedFiles.length !== 1 ? "s" : ""} are now live for
                      readers.
                    </p>
                  </div>
                  <Link
                    to="/comics/$comicId/chapters/$chapterId"
                    params={{ comicId, chapterId }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-body hover:bg-accent/90 transition-colors duration-200"
                    data-ocid="edit_chapter.view_chapter_link"
                  >
                    <ExternalLink className="w-4 h-4" /> View Chapter
                  </Link>
                </motion.div>
              )}

              {/* FAILED */}
              {uploadStage === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                  data-ocid="edit_chapter.error_state"
                >
                  <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="font-body text-sm text-destructive flex-1">
                      {failedMessage}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRetry}
                    className="w-fit"
                    data-ocid="edit_chapter.retry_button"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Retry Upload
                  </Button>
                </motion.div>
              )}

              {/* UPLOADING */}
              {uploadStage === "uploading" && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                  data-ocid="edit_chapter.loading_state"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-sm text-foreground">
                      Uploading {uploadedCount} of {stagedFiles.length}{" "}
                      images...
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="text-muted-foreground hover:text-destructive text-xs"
                      data-ocid="edit_chapter.cancel_button"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                  </div>
                  <Progress
                    value={
                      stagedFiles.length > 0
                        ? (uploadedCount / stagedFiles.length) * 100
                        : 0
                    }
                    className="h-2"
                  />
                  <div className="flex flex-col gap-2 mt-1">
                    {stagedFiles.map((f, i) => (
                      <div
                        key={`up-${f.file.name}-${i}`}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-border"
                        data-ocid={`edit_chapter.upload_files.item.${i + 1}`}
                      >
                        <img
                          src={f.preview}
                          alt={`Page ${i + 1}`}
                          className="w-8 h-11 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-foreground truncate">
                            {f.file.name}
                          </p>
                          {f.retryLabel && (
                            <p className="text-[11px] text-accent font-body mt-0.5">
                              {f.retryLabel}
                            </p>
                          )}
                          {f.status === "uploading" && (
                            <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-accent"
                                animate={{ width: `${f.progress}%` }}
                                transition={{ duration: 0.2 }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {f.status === "pending" && (
                            <span className="text-xs text-muted-foreground">
                              Waiting
                            </span>
                          )}
                          {f.status === "uploading" && (
                            <Loader2 className="w-4 h-4 animate-spin text-accent" />
                          )}
                          {f.status === "done" && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          )}
                          {f.status === "error" && (
                            <XCircle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* IDLE */}
              {uploadStage === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="font-display text-xl text-foreground mb-1">
                      Upload Images
                    </h2>
                    <p className="text-xs text-muted-foreground font-body">
                      Images upload in DRAFT state. All must succeed before
                      publishing. Any failure triggers automatic rollback.
                    </p>
                  </div>

                  {/* Drop zone */}
                  <button
                    type="button"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fileInputRef.current?.click()
                    }
                    className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border hover:border-accent/60 rounded-lg py-10 cursor-pointer transition-colors duration-200 w-full"
                    data-ocid="edit_chapter.dropzone"
                    aria-label="Drop images here or click to browse"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm font-body text-muted-foreground">
                      Drop images here or click to browse
                    </span>
                    <span className="text-xs font-mono text-muted-foreground/60">
                      PNG · JPG · WebP
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleFileSelect}
                      data-ocid="edit_chapter.upload_button"
                    />
                  </button>

                  {/* Staged file list */}
                  {stagedFiles.length > 0 && (
                    <div
                      className="flex flex-col gap-2"
                      data-ocid="edit_chapter.staged_list"
                    >
                      <p className="text-xs font-body text-muted-foreground">
                        {stagedFiles.length} file
                        {stagedFiles.length !== 1 ? "s" : ""} staged
                      </p>
                      <AnimatePresence initial={false}>
                        {stagedFiles.map((f, i) => (
                          <motion.div
                            key={`staged-${f.file.name}-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.18 }}
                            className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border"
                            data-ocid={`edit_chapter.staged_files.item.${i + 1}`}
                          >
                            <img
                              src={f.preview}
                              alt={`Page ${i + 1}`}
                              className="w-9 h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-mono text-foreground truncate">
                                {f.file.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-body">
                                {formatBytes(f.file.size)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => moveFile(i, "up")}
                                disabled={i === 0}
                                aria-label="Move up"
                                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors duration-150"
                                data-ocid={`edit_chapter.move_up.${i + 1}`}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveFile(i, "down")}
                                disabled={i === stagedFiles.length - 1}
                                aria-label="Move down"
                                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors duration-150"
                                data-ocid={`edit_chapter.move_down.${i + 1}`}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                aria-label="Remove file"
                                className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors duration-150"
                                data-ocid={`edit_chapter.remove_file.${i + 1}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Publish button */}
                  <Button
                    type="button"
                    disabled={stagedFiles.length === 0}
                    onClick={handleUploadAndPublish}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="edit_chapter.publish_button"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Upload & Publish
                    {stagedFiles.length > 0
                      ? ` (${stagedFiles.length} image${
                          stagedFiles.length !== 1 ? "s" : ""
                        })`
                      : ""}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      <ConfirmModal
        open={showDeleteModal}
        title="Delete chapter?"
        description="This will permanently delete this chapter and all its images. This cannot be undone."
        confirmLabel="Delete Chapter"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        destructive
      />
    </div>
  );
}
