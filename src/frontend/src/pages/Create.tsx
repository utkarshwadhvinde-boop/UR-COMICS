import { ChapterStatus } from "@/backend";
import { ChapterPreviewModal } from "@/components/ui/ChapterPreviewModal";
import { ALL_GENRES, GenreChip } from "@/components/ui/GenreChip";
import { ImageStitchingModal } from "@/components/ui/ImageStitchingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  isStoppedCanisterError,
  useCreateChapter,
  useCreateComic,
  useListChapters,
  usePublishChapter,
  useUpdateChapter,
  useUpdateComic,
} from "@/hooks/useComicBackend";
import {
  uploadFileToStorage,
  validateAndCoerceImageFile,
} from "@/lib/storageUpload";
import { useAppStore } from "@/store";
import type { Comic, ComicStatus, Genre } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Eye,
  ImagePlus,
  Layers,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type PendingImage = {
  /** blob: URL for local preview — valid only in current session */
  preview: string;
  /** The original File object — used for upload */
  file: File | null;
  /** Permanent storage URL once uploaded — null until then */
  permanentUrl: string | null;
};

type ChapterDraft = {
  title: string;
  /** All pending images in insertion order */
  images: PendingImage[];
  /** Indices into images[], user-controlled display order */
  imageOrder: number[];
  /** true once user clicks Preview — locks reordering */
  orderLocked: boolean;
  backendId: bigint | null;
  chapterNumber: number;
  status: "draft" | "published";
};

// Upload progress state tracked outside React to avoid batching issues
type UploadProgress = { done: number; total: number };

// ─── Status toggle ──────────────────────────────────────────────────────────

function StatusToggle({
  value,
  onChange,
}: {
  value: ComicStatus;
  onChange: (v: ComicStatus) => void;
}) {
  const options: { value: ComicStatus; label: string; color: string }[] = [
    {
      value: "ongoing",
      label: "Ongoing",
      color: "bg-primary text-primary-foreground",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-accent text-accent-foreground",
    },
    {
      value: "hiatus",
      label: "Hiatus",
      color: "bg-muted text-muted-foreground",
    },
  ];
  return (
    <div className="flex gap-2 flex-wrap" data-ocid="create.status_toggle">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border ${
            value === opt.value
              ? `${opt.color} border-primary/30 shadow-sm`
              : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"
          }`}
          data-ocid={`create.status.${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Upload progress bar ─────────────────────────────────────────────────────

function UploadProgressBar({ progress }: { progress: UploadProgress }) {
  if (progress.total === 0) return null;
  const pct = Math.round((progress.done / progress.total) * 100);
  return (
    <div
      className="rounded-xl bg-muted/40 border border-border px-4 py-3"
      data-ocid="create.upload_progress"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">
          Uploading images… {progress.done} of {progress.total}
        </span>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Page thumbnail strip ────────────────────────────────────────────────────

function PageThumbnailRow({
  images,
  imageOrder,
  locked,
  onDrop,
}: {
  images: PendingImage[];
  imageOrder: number[];
  locked: boolean;
  onDrop: (fromPos: number, toPos: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 mt-3"
      data-ocid="create.chapter.page_thumbnails"
    >
      {imageOrder.map((imgIdx, pos) => (
        <div
          key={`${pos}-${imgIdx}`}
          draggable={!locked}
          onDragStart={() => !locked && setDragging(pos)}
          onDragOver={(e) => {
            if (locked) return;
            e.preventDefault();
            setOver(pos);
          }}
          onDrop={(e) => {
            if (locked) return;
            e.preventDefault();
            if (dragging !== null && dragging !== pos) onDrop(dragging, pos);
            setDragging(null);
            setOver(null);
          }}
          onDragEnd={() => {
            setDragging(null);
            setOver(null);
          }}
          className={`relative shrink-0 w-16 h-24 rounded-xl overflow-hidden border-2 transition-smooth ${
            locked
              ? "cursor-default border-border"
              : dragging === pos
                ? "opacity-40 border-primary cursor-grab"
                : over === pos
                  ? "border-primary scale-105 cursor-grab"
                  : "border-border cursor-grab"
          }`}
          data-ocid={`create.chapter.thumbnail.${pos + 1}`}
        >
          <img
            src={images[imgIdx].preview}
            alt={`Page ${pos + 1}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
            {pos + 1}
          </span>
          {images[imgIdx].permanentUrl && (
            <span
              className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 shadow"
              title="Uploaded"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Publish confirm dialog ──────────────────────────────────────────────────

function PublishConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isLoading,
  isActorReady,
  progress,
  error,
  onDismissError,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isActorReady: boolean;
  progress: UploadProgress;
  error: string | null;
  onDismissError: () => void;
}) {
  if (!open) return null;

  // Detect IC0508 stopped-canister errors — show a clean, friendly message
  const isServiceDown =
    error !== null &&
    (error.includes("is stopped") ||
      error.includes("IC0508") ||
      error.includes("temporarily unavailable") ||
      (error.includes("reject_code") &&
        error.includes("5") &&
        error.includes("stopped")));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
      data-ocid="create.publish_dialog"
      style={{ touchAction: "manipulation" }}
    >
      <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-lg animate-scale-in">
        <div className="text-3xl mb-3 text-center">🚀</div>
        <h2 className="text-xl font-display font-bold text-foreground text-center mb-2">
          Ready to Publish?
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          This chapter will be visible to all users immediately.
        </p>

        {/* Actor loading indicator */}
        {!isActorReady && !isLoading && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
            <span className="animate-spin w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full" />
            Connecting to backend…
          </div>
        )}

        {/* Error banner — friendly for service-down, detailed for other errors */}
        {error && (
          <div
            className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3"
            data-ocid="create.publish_error_state"
          >
            {isServiceDown ? (
              // ── Clean service-unavailable message (IC0508 / stopped canister) ──
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-destructive mb-1">
                    Publishing service unavailable
                  </p>
                  <p className="text-xs text-destructive/80 leading-relaxed">
                    The publishing service is temporarily unavailable. Please
                    wait a moment and try again.
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive text-sm font-semibold py-2 transition-colors"
                  onClick={() => {
                    onDismissError();
                    onConfirm();
                  }}
                  data-ocid="create.publish_retry_button"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onDismissError}
                >
                  Dismiss
                </button>
              </div>
            ) : (
              // ── Standard error banner for all other failures ──
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-destructive mb-0.5">
                      Publish failed
                    </p>
                    <p className="text-xs text-destructive/80 whitespace-pre-wrap break-words">
                      {error}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-destructive/60 hover:text-destructive transition-colors shrink-0"
                  onClick={onDismissError}
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {!isServiceDown && (
              <p className="text-xs text-muted-foreground mt-2">
                Your draft and uploaded images are safe. Tap{" "}
                <strong>Publish Now</strong> to retry.
              </p>
            )}
          </div>
        )}

        {isLoading && progress.total > 0 && (
          <div className="mb-4">
            <UploadProgressBar progress={progress} />
          </div>
        )}

        {isLoading && progress.total === 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
            <span className="animate-spin w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full" />
            Publishing…
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onCancel}
            disabled={isLoading}
            data-ocid="create.publish_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 gradient-primary text-primary-foreground border-0 rounded-xl shadow-glow gap-2"
            onClick={onConfirm}
            disabled={isLoading || !isActorReady || isServiceDown}
            style={{ touchAction: "manipulation" }}
            data-ocid="create.publish_confirm_button"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" />
            ) : !isActorReady ? (
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isLoading
              ? "Publishing…"
              : !isActorReady
                ? "Loading…"
                : isServiceDown
                  ? "Unavailable"
                  : error
                    ? "Retry Publish"
                    : "Publish Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Chapter editor ──────────────────────────────────────────────────────────

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
}: {
  chapters: ChapterDraft[];
  isPublishing: boolean;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: "title" | "chapterNumber", val: string) => void;
  onStitchImages: (chapterIndex: number) => void;
  onThumbnailDrop: (chapterIdx: number, fromPos: number, toPos: number) => void;
  onImageUpload: (chapterIdx: number, files: File[]) => void;
  onPreview: (chapterIdx: number) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-semibold">
          Chapters
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            ({chapters.length} total)
          </span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={isPublishing}
          className="rounded-xl gap-1"
          data-ocid="create.add_chapter_button"
        >
          <Plus className="w-4 h-4" /> Add Chapter
        </Button>
      </div>

      <div className="space-y-2">
        {chapters.map((ch, i) => (
          <div
            key={`${ch.chapterNumber}-${ch.title}`}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid={`create.chapter.item.${i + 1}`}
          >
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-muted/20 transition-colors text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {ch.chapterNumber}
              </span>
              <Input
                value={ch.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onChange(i, "title", e.target.value)}
                placeholder={`Chapter ${ch.chapterNumber} title`}
                className="rounded-lg h-8 text-sm border-0 bg-transparent focus-visible:ring-1 px-2"
                data-ocid={`create.chapter.title_input.${i + 1}`}
              />
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  ch.status === "published"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {ch.status === "published" ? "Live" : "Draft"}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {expanded === i ? "▲" : "▼"}
                </span>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    data-ocid={`create.chapter.delete_button.${i + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </button>

            {expanded === i && (
              <div className="px-4 pb-4 border-t border-border/50">
                <div className="mt-3 mb-2">
                  <Label className="text-xs text-muted-foreground mb-1 block">
                    Chapter Number
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={ch.chapterNumber}
                    onChange={(e) =>
                      onChange(i, "chapterNumber", e.target.value)
                    }
                    className="rounded-xl h-8 w-28 text-sm"
                    data-ocid={`create.chapter.number_input.${i + 1}`}
                  />
                </div>

                {!ch.orderLocked && (
                  <label
                    htmlFor={`chapter-img-input-${i}`}
                    className="flex flex-col items-center justify-center w-full min-h-[80px] rounded-xl border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-smooth mt-2 gap-1"
                    data-ocid={`create.chapter.image_upload.${i + 1}`}
                  >
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {ch.images.length > 0
                        ? `${ch.images.length} page${
                            ch.images.length !== 1 ? "s" : ""
                          } — click to add more`
                        : "Upload chapter images (multi-select supported)"}
                    </span>
                    <input
                      id={`chapter-img-input-${i}`}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files)
                          onImageUpload(i, Array.from(e.target.files));
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}

                {ch.orderLocked && ch.images.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Order locked after preview. {ch.images.length} page
                    {ch.images.length !== 1 ? "s" : ""} ready to publish.
                  </div>
                )}

                <PageThumbnailRow
                  images={ch.images}
                  imageOrder={ch.imageOrder}
                  locked={ch.orderLocked}
                  onDrop={(from, to) => onThumbnailDrop(i, from, to)}
                />

                <div className="flex items-center justify-between mt-3 gap-2">
                  <p className="text-xs text-muted-foreground">
                    {ch.orderLocked
                      ? "Preview locked — order is final."
                      : "Drag thumbnails to reorder before publishing."}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    {ch.images.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => onPreview(i)}
                        data-ocid={`create.chapter.preview_button.${i + 1}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </Button>
                    )}
                    {!ch.orderLocked && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => onStitchImages(i)}
                        data-ocid={`create.chapter.stitch_button.${i + 1}`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Stitch Images
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CreatePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { edit?: string };
  const editId = search?.edit;
  const { currentUser, comics, addComic } = useAppStore();

  const existing = editId ? comics.find((c) => c.id === editId) : null;
  const existingBackendId: bigint | null =
    (existing as (Comic & { backendId?: bigint }) | undefined)?.backendId ??
    null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
    existing?.genres ?? [],
  );
  const [coverUrl, setCoverUrl] = useState(existing?.coverImage ?? "");
  const [coverPreview, setCoverPreview] = useState(existing?.coverImage ?? "");
  const [status, setStatus] = useState<ComicStatus>(
    existing?.status ?? "ongoing",
  );
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    existing?.chapters.map((ch, i) => ({
      title: ch.title,
      images: (ch.pages ?? []).map((url) => ({
        preview: url,
        file: null,
        permanentUrl: url.startsWith("blob:") ? null : url,
      })),
      imageOrder: ch.imageOrder ?? (ch.pages ?? []).map((_, idx) => idx),
      orderLocked: false,
      backendId: (ch as typeof ch & { backendId?: bigint }).backendId ?? null,
      chapterNumber: ch.chapterNumber ?? i + 1,
      status: ch.chapterStatus ?? "draft",
    })) ?? [
      {
        title: "Chapter 1",
        images: [],
        imageOrder: [],
        orderLocked: false,
        backendId: null,
        chapterNumber: 1,
        status: "draft",
      },
    ],
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    done: 0,
    total: 0,
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [stitchModalOpen, setStitchModalOpen] = useState(false);
  const [stitchTargetChapter, setStitchTargetChapter] = useState(0);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewChapterIdx, setPreviewChapterIdx] = useState(0);
  const [publishedComicId, setPublishedComicId] = useState<string | null>(null);
  const [publishedChapterId, setPublishedChapterId] = useState<string | null>(
    null,
  );
  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);
  const [backendComicId, setBackendComicId] = useState<bigint | null>(
    existingBackendId,
  );
  const hasUnsavedRef = useRef(false);
  const isPublishingRef = useRef(false);

  const createComicMutation = useCreateComic();
  const updateComicMutation = useUpdateComic();
  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();
  const publishChapterMutation = usePublishChapter();

  // Actor readiness: all mutations share the same underlying actor.
  // Use createComicMutation as the single source of truth.
  const isActorReady = createComicMutation.isActorReady;

  const { data: existingChapters } = useListChapters(backendComicId, false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    hasUnsavedRef.current = true;
  }, [title, description, selectedGenres, coverUrl, status, chapters]);

  // Autosave every 30s
  useEffect(() => {
    if (!backendComicId) return;
    const id = setInterval(() => {
      if (hasUnsavedRef.current) void doSaveDraft(true);
    }, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendComicId]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const toggleGenre = (genre: Genre | "All") => {
    if (genre === "All") return;
    setSelectedGenres((prev) =>
      prev.includes(genre as Genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre as Genre],
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      // Keep blob URL as preview only — never store it as the final cover URL
      setCoverUrl("");
      const reason = err instanceof Error ? err.message : String(err);
      toast.error(`Cover upload failed: ${reason}. Please try again.`);
    }
  };

  const addChapterDraft = () =>
    setChapters((prev) => [
      ...prev,
      {
        title: `Chapter ${prev.length + 1}`,
        images: [],
        imageOrder: [],
        orderLocked: false,
        backendId: null,
        chapterNumber: prev.length + 1,
        status: "draft",
      },
    ]);

  const removeChapterDraft = (idx: number) =>
    setChapters((prev) => prev.filter((_, i) => i !== idx));

  const updateChapterField = (
    i: number,
    field: "title" | "chapterNumber",
    val: string,
  ) =>
    setChapters((prev) =>
      prev.map((c, idx) =>
        idx === i
          ? {
              ...c,
              [field]:
                field === "chapterNumber" ? Number.parseInt(val) || 1 : val,
            }
          : c,
      ),
    );

  /** Validate then append new images as PendingImage entries (Android-safe) */
  const handleImageUpload = (chapterIdx: number, files: File[]) => {
    const valid: File[] = [];
    const invalid: string[] = [];
    for (const raw of files) {
      
      const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

if (!allowedTypes.includes(raw.type)) {
  invalid.push(`${raw.name} (unsupported format)`);
  continue;
}
      
      if (raw.size > 15 * 1024 * 1024) {
  invalid.push(`${raw.name} (too large)`);
  continue;
      }
      
      try {
        const coerced = validateAndCoerceImageFile(raw);
        valid.push(coerced);
      } catch {
        invalid.push(raw.name);
      }
    }
    if (invalid.length > 0) {
      toast.error(
        `Skipped ${invalid.length} invalid file(s): ${invalid.slice(0, 3).join(", ")}`,
      );
    }
    const currentCount = chapters[chapterIdx]?.images.length ?? 0;

if (currentCount + valid.length > 300) {
  toast.error("Maximum 300 images allowed per chapter.");
  return;
}
    if (valid.length === 0) return;

    setChapters((prev) =>
      prev.map((ch, i) => {
        if (i !== chapterIdx) return ch;
        const start = ch.images.length;
        const newEntries: PendingImage[] = valid.map((f) => ({
          preview: URL.createObjectURL(f),
          // CRITICAL: Keep File reference alive — never nullify until publish is done
          file: f,
          permanentUrl: null,
        }));
        return {
          ...ch,
          images: [...ch.images, ...newEntries],
          imageOrder: [
            ...ch.imageOrder,
            ...newEntries.map((_, j) => start + j),
          ],
        };
      }),
    );
  };

  const handleThumbnailDrop = (
    _chapterIdx: number,
    fromPos: number,
    toPos: number,
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) => {
        if (i !== _chapterIdx || ch.orderLocked) return ch;
        const newOrder = [...ch.imageOrder];
        const [moved] = newOrder.splice(fromPos, 1);
        newOrder.splice(toPos, 0, moved);
        return { ...ch, imageOrder: newOrder };
      }),
    );
  };

  /** Open preview and lock order for that chapter */
  const handlePreviewChapter = (idx: number) => {
    setPreviewChapterIdx(idx);
    setPreviewOpen(true);
    // Lock the image order once the user sees the preview
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === idx && !ch.orderLocked ? { ...ch, orderLocked: true } : ch,
      ),
    );
  };

  /**
   * Upload all pending (non-permanent) images for a single chapter.
   * Returns the updated PendingImage array.
   * Throws if any upload fails — caller must handle and abort publish.
   * CRITICAL: File objects are KEPT alive (not nulled) so retries work.
   */
 if (
  chapterBackendId === null ||
  chapterBackendId === undefined ||
  String(chapterBackendId).trim() === "" ||
  String(chapterBackendId) === "new"
) {
  throw new Error(
    "chapter record was not created before upload. Cannot build a valid storage path. Please retry publish.",
  );
}

    const updated: PendingImage[] = [...ch.images];
    const ts = Date.now();
    const randomTag = Math.random().toString(36).slice(2, 7);

    for (let imgIdx = 0; imgIdx < ch.images.length; imgIdx++) {
      const img = ch.images[imgIdx];
      if (img.permanentUrl) {
        // Already uploaded — count as done
        onProgress(progressOffset + imgIdx + 1);
        continue;
      }

      // Build a unique file name to avoid overwriting existing files
      const ext = img.file?.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const pageNum = String(imgIdx + 1).padStart(2, "0");
      // chapterBackendId is guaranteed real at this point (guard above)
      const uniqueName = `${comicBackendId}/${chapterBackendId}/${ts}-${randomTag}-page${pageNum}.${ext}`;
      console.info(
        `[Publish] Uploading image ${imgIdx + 1}/${ch.images.length} — path: "${uniqueName}", size: ${img.file?.size ?? "unknown"} bytes, MIME: ${img.file?.type || "(unknown)"}`,
      );

      // We must have a File object to upload
      let fileToUpload: File;
      if (img.file) {
        // Re-validate in case type was missing (Android)
        try {
          fileToUpload = validateAndCoerceImageFile(img.file);
        } catch {
          fileToUpload = img.file;
        }
        // Rename with unique path
        fileToUpload = new File([fileToUpload], uniqueName, {
          type: fileToUpload.type,
        });
      } else if (img.preview.startsWith("blob:")) {
        // CRITICAL: Never fall back to blob URLs — they expire on tab reopen or Android background.
        // If File reference is null here, the user must re-upload this image.
        throw new Error(
          `Image ${imgIdx + 1} in Chapter ${ch.chapterNumber} could not be uploaded — the file reference was lost. Please remove this image and re-upload it from your gallery.`,
        );
      } else {
        // Already a permanent URL stored in preview field
        updated[imgIdx] = {
          ...img,
          permanentUrl: img.preview,
        };
        onProgress(progressOffset + imgIdx + 1);
        continue;
      }

      try {
        console.log("[Publish] Uploading image...");
        const permanentUrl = await uploadFileToStorage(fileToUpload);
        console.info(
          `[Publish] ✓ Image ${imgIdx + 1} uploaded successfully — permanent URL obtained`,
        );
        updated[imgIdx] = {
          // CRITICAL: Keep original File reference — do NOT nullify file
          preview: permanentUrl,
          file: img.file, // keep original File so retries can re-use it
          permanentUrl,
        };
        onProgress(progressOffset + imgIdx + 1);
      } catch (uploadErr) {
        const reason =
          uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
        console.error(
          `[Publish] ✗ Upload FAILED for image ${imgIdx + 1}/${ch.images.length} in chapter "${ch.title}":`,
          reason,
          uploadErr,
        );
        throw new Error(
          `Image ${imgIdx + 1} in Chapter "${ch.title}" failed to upload.\n${reason}`,
        );
      }
    }
    return updated;
  }

  async function doSaveDraft(
    silent = false,
  ): Promise<{ comicId: bigint | null; updatedChapters: ChapterDraft[] }> {
    if (!title.trim()) {
      if (!silent) toast.error("Please enter a title first");
      return { comicId: null, updatedChapters: chapters };
    }
    setIsSaving(true);
    try {
      let comicId = backendComicId;

      // Blob URLs are temporary — never save them as permanent cover URL.
      // If cover is still a blob (upload failed earlier), use placeholder.
      let finalCoverUrl = coverUrl;
      if (!finalCoverUrl || finalCoverUrl.startsWith("blob:")) {
        finalCoverUrl = "/assets/generated/cover-lost-realm.dim_400x600.jpg";
        setCoverUrl(finalCoverUrl);
        setCoverPreview(finalCoverUrl);
      }

      const comicInput = {
        title: title.trim(),
        description: description.trim(),
        author: currentUser?.username ?? "Anonymous",
        coverUrl:
          finalCoverUrl || "/assets/generated/cover-lost-realm.dim_400x600.jpg",
        genres: selectedGenres,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        isPinned: false,
        ownerUploaded: false,
        creatorId: currentUser?.id ?? "anonymous",
      };

      if (!comicId) {
        const newId = await createComicMutation.mutateAsync(comicInput);
        comicId = newId;
        setBackendComicId(newId);
        const localComic: Comic & { backendId: bigint } = {
          id: String(newId),
          backendId: newId,
          title: title.trim(),
          description: description.trim(),
          author: currentUser?.username ?? "Anonymous",
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
          creatorId: currentUser?.id ?? "anonymous",
          isOwnerComic: false,
        };
        addComic(localComic as unknown as Comic);
      } else {
        await updateComicMutation.mutateAsync({
          id: comicId,
          input: comicInput,
        });
      }

      const updatedChapters = await Promise.all(
        chapters.map(async (ch) => {
          const dup = existingChapters?.find(
            (ec) =>
              Number(ec.chapterNumber) === ch.chapterNumber &&
              (ch.backendId === null || ec.id !== ch.backendId),
          );
          if (dup) {
            if (!silent)
              toast.error(
                `Chapter ${ch.chapterNumber} already exists. Use a different number.`,
              );
            return ch;
          }

          // For silent/draft saves, only upload images that already have File objects
          // (don't upload blobs that may have expired — those are handled during publish)
          const updatedImages = await Promise.all(
            ch.images.map(async (img) => {
              if (img.permanentUrl) return img;
              if (!img.file) return img; // blob without File — defer to publish
              try {
                const permanentUrl = await uploadFileToStorage(img.file);
                // CRITICAL: keep File reference alive — do NOT null it out
                return { preview: permanentUrl, file: img.file, permanentUrl };
              } catch {
                return img; // keep for now
              }
            }),
          );

          // Build arrays using imageOrder for correct sequence
          const orderedPermanentUrls = ch.imageOrder.map(
            (idx) =>
              updatedImages[idx]?.permanentUrl ??
              updatedImages[idx]?.preview ??
              "",
          );

          const input = {
            title: ch.title || `Chapter ${ch.chapterNumber}`,
            chapterNumber: BigInt(ch.chapterNumber),
            images: orderedPermanentUrls,
            imageKeys: orderedPermanentUrls.filter(Boolean),
            imageOrder: ch.imageOrder.map((n) => BigInt(n)),
            comicId: comicId!,
            creatorId: currentUser?.id ?? "anonymous",
            chapterStatus: ChapterStatus.draft,
          };

          if (!ch.backendId) {
            const chapId = await createChapterMutation.mutateAsync(input);
            return { ...ch, images: updatedImages, backendId: chapId };
          }
          await updateChapterMutation.mutateAsync({
            id: ch.backendId,
            input,
          });
          return { ...ch, images: updatedImages };
        }),
      );

      setChapters(updatedChapters);
      hasUnsavedRef.current = false;
      const ts = new Date().toLocaleTimeString();
      setSavedAt(ts);
      if (!silent)
        toast.success("Draft saved!", { description: `Saved at ${ts}` });
      return { comicId, updatedChapters };
    } catch (err) {
      if (!silent)
        toast.error(err instanceof Error ? err.message : "Save failed");
      return { comicId: null, updatedChapters: chapters };
    } finally {
      setIsSaving(false);
    }
  }

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActorReady) {
      setPublishError(
        "System is still loading, please wait a moment and try again.",
      );
      return;
    }
    await doSaveDraft(false);
  };

  const handleOpenPublishConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActorReady) {
      setPublishError(
        "System is still loading, please wait a moment and try again.",
      );
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (selectedGenres.length === 0) {
      toast.error("Select at least one genre");
      return;
    }
    if (chapters.length === 0) {
      toast.error("Add at least one chapter");
      return;
    }
    const empty = chapters.find((ch) => ch.images.length === 0);
    if (empty) {
      toast.error(
        `Chapter ${empty.chapterNumber} has no images. Upload at least one page.`,
      );
      return;
    }
    const nums = chapters.map((c) => c.chapterNumber);

const hasDuplicates =
  new Set(nums).size !== nums.length;

if (hasDuplicates) {
  toast.error("Duplicate chapter numbers are not allowed.");
  return;
}
    setPublishConfirmOpen(true);
  };

  const handlePublishConfirm = async () => {
    // ── Actor readiness guard ────────────────────────────────────────────────
    if (!isActorReady) {
      setPublishError(
        "System is still loading. Please wait a moment and tap Publish Now again.",
      );
      return;
    }
    // ── Double-click / double-tap guard ─────────────────────────────────────
    if (isPublishingRef.current || isPublishing) {
      console.log("[Publish] Already publishing — ignoring duplicate call");
      return;
    }
    isPublishingRef.current = true;
    setIsPublishing(true);
    console.log("[Publish] STARTED");
    setPublishError(null);
    setUploadProgress({ done: 0, total: 0 });

    const failPublish = (step: string, err: unknown) => {
      // Detect IC0508 stopped-canister — show a clean message, not the raw IC rejection
      const rawMsg = err instanceof Error ? err.message : String(err);
      const isServiceDown = isStoppedCanisterError(err);
      const displayMsg = isServiceDown
        ? "Service temporarily unavailable — please try again in a moment."
        : rawMsg;
      console.error(`[Publish] FAILED at "${step}":`, rawMsg, err);
      setPublishError(`${step}\n${displayMsg}`);
      console.log("[Publish] FINISHED");
      setIsPublishing(false);
      isPublishingRef.current = false;
      setUploadProgress({ done: 0, total: 0 });
    };

    console.log("[Publish] Starting publish…");

    try {
      // ── Step 1: Validate ─────────────────────────────────────────────────
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
          new Error(`Chapter ${emptyChapter.chapterNumber} has no images.`),
        );
        return;
      }

      // ── Step 1b: Pre-validate file references (catches Android "file lost" case) ─
      console.log("[Publish] Step 1b — Pre-validating file references…");
      for (const ch of chapters) {
        for (let imgIdx = 0; imgIdx < ch.images.length; imgIdx++) {
          const img = ch.images[imgIdx];
          const hasPermanent =
            img.permanentUrl && !img.permanentUrl.startsWith("blob:");
          const hasFile = img.file !== null;
          if (!hasPermanent && !hasFile) {
            failPublish(
              `Validate images for Chapter ${ch.chapterNumber}`,
              new Error(
                `Image ${imgIdx + 1} in Chapter "${ch.title}" file reference was lost. Please remove this image and re-select it from your gallery.`,
              ),
            );
            return;
          }
        }
      }
      console.log("[Publish] Step 1b — All file references valid ✓");

      // ── Step 2: Ensure comic exists in backend ───────────────────────────
      console.log("[Publish] Step 2 — Saving comic to backend…");
      let comicId = backendComicId;
      // Blob URLs are temporary — never pass them to the backend.
      // If cover is still a blob (upload failed or user hasn't uploaded), use placeholder.
      let finalCoverUrl = coverUrl;
      if (!finalCoverUrl || finalCoverUrl.startsWith("blob:")) {
        console.warn(
          "[Publish] Cover is a blob URL or missing — using placeholder.",
        );
        finalCoverUrl = "/assets/generated/cover-lost-realm.dim_400x600.jpg";
        setCoverUrl(finalCoverUrl);
        setCoverPreview(finalCoverUrl);
      }

      const comicInput = {
        title: title.trim(),
        description: description.trim(),
        author: currentUser?.username ?? "Anonymous",
        coverUrl:
          finalCoverUrl || "/assets/generated/cover-lost-realm.dim_400x600.jpg",
        genres: selectedGenres,
        isPremium: false,
        isFeatured: false,
        isTrending: false,
        isPinned: false,
        ownerUploaded: false,
        creatorId: currentUser?.id ?? "anonymous",
      };

      if (!comicId) {
        try {
          const newId = await createComicMutation.mutateAsync(comicInput);
          comicId = newId;
          setBackendComicId(newId);
          const localComic: Comic & { backendId: bigint } = {
            id: String(newId),
            backendId: newId,
            title: title.trim(),
            description: description.trim(),
            author: currentUser?.username ?? "Anonymous",
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
            creatorId: currentUser?.id ?? "anonymous",
            isOwnerComic: false,
          };
          addComic(localComic as unknown as Comic);
          console.log(`[Publish] Comic created: backendId=${newId}`);
        } catch (e) {
          failPublish("Create comic in backend", e);
          return;
        }
      } else {
        try {
          await updateComicMutation.mutateAsync({
            id: comicId,
            input: comicInput,
          });
          console.log(`[Publish] Comic updated: backendId=${comicId}`);
        } catch (e) {
          console.warn(
            "[Publish] Comic update failed — continuing with existing record.",
            e,
          );
        }
      }

      // ── Step 3: Create chapter records in backend FIRST (get real chapterIds) ──
      // ROOT CAUSE FIX: Chapter must be created before images upload so that the
      // storage path uses the real chapterId: "comicId/chapterId/filename.jpg".
      // The old order (upload first, then create chapter) produced path
      // "comicId/new/filename.jpg" which is rejected with 403 Forbidden.
      console.log(
        "[Publish] Step 3 — Creating chapter records (to obtain real IDs before upload)…",
      );
      setUploadProgress({ done: 0, total: 0 });
      const chaptersWithIds: ChapterDraft[] = [];

      for (const ch of chapters) {
        const dup = existingChapters?.find(
          (ec) =>
            Number(ec.chapterNumber) === ch.chapterNumber &&
            (ch.backendId === null || ec.id !== ch.backendId),
        );
        if (dup) {
          console.warn(
            `[Publish] Duplicate chapter number ${ch.chapterNumber} — skipping.`,
          );
          toast.warning(
            `Chapter ${ch.chapterNumber} number already taken — skipped.`,
          );
          chaptersWithIds.push(ch);
          continue;
        }

        // Create a draft placeholder with empty images to receive the real chapterId.
        // Image URLs are filled in after upload in Step 4b.
        const draftInput = {
          title: ch.title || `Chapter ${ch.chapterNumber}`,
          chapterNumber: BigInt(ch.chapterNumber),
          images: [] as string[],
          imageKeys: [] as string[],
          imageOrder: ch.imageOrder.map((n) => BigInt(n)),
          comicId: comicId!,
          creatorId: currentUser?.id ?? "anonymous",
          chapterStatus: ChapterStatus.draft,
        };

        // IMPORTANT: Use null/undefined check (not falsy) — BigInt 0n is falsy but valid
        let chapterBackendId: bigint | null = ch.backendId ?? null;
        try {
          if (chapterBackendId === null || chapterBackendId === undefined) {
            // STEP B: Create the chapter record FIRST — this gives us a real chapterId
            // before any image upload begins. Without a real ID, the storage path
            // would be "comicId/new/filename" which causes 403 Forbidden.
            console.log("[Publish] Creating chapter...");

const createdChapter =
  await createChapterMutation.mutateAsync(draftInput);

const createdId =
  typeof createdChapter === "bigint"
    ? createdChapter
    : createdChapter?.id;

if (createdId === null || createdId === undefined) {
  throw new Error("Failed to get valid chapter ID");
}
            // Explicit guard: even if returned value is 0n (falsy), treat it as valid
            if (createdId === null || createdId === undefined) {
              failPublish(
                `Create chapter record for Chapter ${ch.chapterNumber}`,
                new Error(
                  "Backend returned no chapter ID. Cannot upload images without a valid chapter ID.",
                ),
              );
              return;
            }
            chapterBackendId = createdId;
            console.log(
              `[Publish] Chapter ${ch.chapterNumber} record created: id=${chapterBackendId}`,
            );
          } else {
            // Existing chapter — update metadata but keep images until after upload
            await updateChapterMutation.mutateAsync({
              id: chapterBackendId,
              input: draftInput,
            });
            console.log(
              `[Publish] Chapter ${ch.chapterNumber} record refreshed: id=${chapterBackendId}`,
            );
          }
        } catch (e) {
          failPublish(
            `Create chapter record for Chapter ${ch.chapterNumber}`,
            e,
          );
          return;
        }

        // STEP B guard: after create/update, chapterId MUST be a real non-null value
        // This is the critical check that prevents uploads to invalid paths.
        if (chapterBackendId === null || chapterBackendId === undefined) {
          failPublish(
            `Create chapter record for Chapter ${ch.chapterNumber}`,
            new Error(
              "Chapter record creation failed — no valid ID returned from backend. Cannot upload images.",
            ),
          );
          return;
        }

        chaptersWithIds.push({ ...ch, backendId: chapterBackendId });
      }

      // ── Step 4: Upload images using real chapterId paths ──────────────────
      // Now every chapter has a real backendId — storage path is valid:
      // "comicId/chapterId/timestamp-random-pageN.jpg" — no more 403 errors.
      console.log(
        "[Publish] Step 4 — Uploading images with valid chapter IDs…",
      );
      const totalImages = chaptersWithIds.reduce(
        (sum, ch) => sum + ch.images.filter((img) => !img.permanentUrl).length,
        0,
      );
      setUploadProgress({ done: 0, total: totalImages });

      let doneCount = 0;
      const chaptersWithUploads: ChapterDraft[] = [];

      for (let ci = 0; ci < chaptersWithIds.length; ci++) {
        const ch = chaptersWithIds[ci];
        let uploadedImages: PendingImage[];
        try {
          uploadedImages = await uploadChapterImages(
            ch,
            ci,
            comicId!,
            ch.backendId, // Always a real ID now
            doneCount,
            totalImages,
            (done) => {
              doneCount = done;
              setUploadProgress({ done, total: totalImages });
            },
          );
        } catch (e) {
          failPublish(`Upload images for Chapter ${ch.chapterNumber}`, e);
          return;
        }

        // Verify every image has a permanent URL before proceeding.
        // Never send blob: URLs to the backend — they expire on refresh/other devices.
        const blobImages = uploadedImages
          .map((img, idx) => ({ img, idx }))
          .filter(
            ({ img }) =>
              !img.permanentUrl || img.permanentUrl.startsWith("blob:"),
          );
        if (blobImages.length > 0) {
          failPublish(
            `Upload images for Chapter ${ch.chapterNumber}`,
            new Error(
              `${blobImages.length} image(s) still have temporary URLs (blob:) and were not uploaded to permanent storage. Affected page(s): ${blobImages.map(({ idx }) => idx + 1).join(", ")}. Please remove and re-upload those images.`,
            ),
          );
          return;
        }

        doneCount += ch.images.filter((img) => !img.permanentUrl).length;
        chaptersWithUploads.push({ ...ch, images: uploadedImages });
      }
      console.log(`[Publish] Image uploads complete (${totalImages} total) ✓`);

      // ── Step 4b: Update chapter records with permanent image URLs ─────────
      console.log(
        "[Publish] Step 4b — Writing permanent image URLs to chapter records…",
      );
      setUploadProgress({ done: 0, total: 0 });
      const savedChapters: ChapterDraft[] = [];

      for (const ch of chaptersWithUploads) {
        if (!ch.backendId) {
          // Duplicate-skipped chapter — pass through unchanged
          savedChapters.push(ch);
          continue;
        }

        // Build ordered URL arrays — never send blob: URLs to the backend
        const orderedUrls = ch.imageOrder.map((idx) => {
          const img = ch.images[idx];
          const url = img?.permanentUrl ?? img?.preview ?? "";
          if (url.startsWith("blob:")) {
            console.error(
              `[Publish] BUG: blob URL slipped through for image ${idx} in chapter ${ch.chapterNumber}`,
            );
            return "";
          }
          return url;
        });

        const finalInput = {
          title: ch.title || `Chapter ${ch.chapterNumber}`,
          chapterNumber: BigInt(ch.chapterNumber),
          images: orderedUrls,
          imageKeys: orderedUrls.filter(Boolean),
          imageOrder: ch.imageOrder.map((n) => BigInt(n)),
          comicId: comicId!,
          creatorId: currentUser?.id ?? "anonymous",
          chapterStatus: ChapterStatus.draft,
        };

        try {
          await updateChapterMutation.mutateAsync({
            id: ch.backendId,
            input: finalInput,
          });
          console.log(
            `[Publish] Chapter ${ch.chapterNumber} updated with ${orderedUrls.filter(Boolean).length} image URLs ✓`,
          );
        } catch (e) {
          failPublish(`Update Chapter ${ch.chapterNumber} with image URLs`, e);
          return;
        }

        savedChapters.push(ch);
      }

      // ── Step 5: Publish each chapter ─────────────────────────────────────
      console.log("[Publish] Step 5 — Publishing chapters…");
      let firstPublishedId: bigint | null = null;
      let publishedCount = 0;
      const publishErrors: string[] = [];

      for (const ch of savedChapters) {
        if (!ch.backendId) {
          publishErrors.push(`Chapter ${ch.chapterNumber}: no backend ID`);
          continue;
        }
        try {
          await publishChapterMutation.mutateAsync(ch.backendId);
          if (!firstPublishedId) firstPublishedId = ch.backendId;
          publishedCount++;
          console.log(`[Publish] Chapter ${ch.chapterNumber} published ✓`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(
            `[Publish] Chapter ${ch.chapterNumber} FAILED:`,
            msg,
            e,
          );
          publishErrors.push(`Chapter ${ch.chapterNumber}: ${msg}`);
        }
      }

      if (publishedCount === 0) {
        const detail =
          publishErrors.length > 0
            ? publishErrors.join(" | ")
            : "No chapters were published — please try again.";
        failPublish("Publish chapters", new Error(detail));
        return;
      }

      if (publishErrors.length > 0) {
        console.warn(
          "[Publish] Partial success — some chapters failed:",
          publishErrors,
        );
        toast.warning(
          `${publishedCount} published, ${publishErrors.length} failed.`,
        );
      }

      // ── Step 6: Update local state and show success ───────────────────────
      console.log("[Publish] 🎉 Publish complete!");
      const finalChapters = savedChapters.map((ch) => ({
        ...ch,
        status: ch.backendId !== null ? ("published" as const) : ch.status,
      }));
      setChapters(finalChapters);
      hasUnsavedRef.current = false;

      const comicIdStr = comicId ? String(comicId) : null;
      const chapterIdStr = firstPublishedId ? String(firstPublishedId) : null;
      setPublishedComicId(comicIdStr);
      setPublishedChapterId(chapterIdStr);
      setPublishConfirmOpen(false);
      setPublishError(null);
      setPublishSuccessOpen(true);

      toast.success("Chapter published!", {
        description: `"${title}" is now live for all readers.`,
      });
    } catch (err) {
      // Catch-all: ensure isPublishing and ref are always reset
      failPublish("Publish", err);
      return;
    } finally {
      // BUG FIX: Always reset publishing state in finally so the button
      // never stays permanently disabled after an unexpected error.
      // failPublish() already calls these, so this is a safety net for
      // cases where an error occurs INSIDE failPublish itself or any
      // other code path that bypasses the normal reset.
      setIsPublishing(false);
      isPublishingRef.current = false;
      setUploadProgress({ done: 0, total: 0 });
    }
  };

  const handleStitchedImages = (imageUrls: string[]) => {
    setChapters((prev) =>
      prev.map((ch, i) => {
        if (i !== stitchTargetChapter) return ch;
        const start = ch.images.length;
        const newEntries: PendingImage[] = imageUrls.map((url) => ({
          preview: url,
          file: null,
          // Stitcher returns permanent URLs from storage already
          permanentUrl: url.startsWith("blob:") ? null : url,
        }));
        return {
          ...ch,
          images: [...ch.images, ...newEntries],
          imageOrder: [
            ...ch.imageOrder,
            ...newEntries.map((_, j) => start + j),
          ],
        };
      }),
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" data-ocid="create.page">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {existing ? "Edit Comic" : "Upload Your Comic"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {existing
              ? "Update your comic details and chapters"
              : "Share your story with the world"}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1 shrink-0">
          {existing && (
            <Badge variant="secondary" className="rounded-full">
              Editing
            </Badge>
          )}
          {savedAt && (
            <span className="text-xs text-muted-foreground">
              ✓ Saved {savedAt}
            </span>
          )}
        </div>
      </div>

      <form
        onSubmit={handleOpenPublishConfirm}
        className="space-y-8"
        data-ocid="create.form"
      >
        {/* Cover + Title */}
        <div className="grid md:grid-cols-[200px_1fr] gap-6 bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div>
            <Label className="text-sm font-semibold mb-2 block">
              Cover Image
            </Label>
            <label
              htmlFor="cover-file-input"
              className="flex flex-col items-center justify-center w-full aspect-[2/3] rounded-2xl border-2 border-dashed border-border bg-muted/40 cursor-pointer hover:bg-muted/60 transition-smooth overflow-hidden"
              data-ocid="create.cover_upload"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={() => setCoverPreview("")}
                />
              ) : (
                <div className="text-center p-4">
                  <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Upload cover</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    or paste URL below
                  </p>
                </div>
              )}
              <input
                id="cover-file-input"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
            <Input
              value={coverUrl}
              onChange={(e) => {
                setCoverUrl(e.target.value);
                setCoverPreview(e.target.value);
              }}
              placeholder="Paste image URL..."
              className="rounded-xl mt-2 text-xs h-8"
              data-ocid="create.cover_url_input"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-semibold mb-1.5 block"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter comic title..."
                className="rounded-xl"
                data-ocid="create.title_input"
              />
            </div>
            <div>
              <Label
                htmlFor="desc"
                className="text-sm font-semibold mb-1.5 block"
              >
                Description
              </Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your comic..."
                rows={4}
                className="rounded-xl resize-none"
                data-ocid="create.description_textarea"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Status</Label>
              <StatusToggle value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <Label className="text-sm font-semibold mb-3 block">
            Genres *
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (select at least one)
            </span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.filter((g) => g !== "All").map((genre, i) => (
              <GenreChip
                key={genre}
                genre={genre}
                isActive={selectedGenres.includes(genre as Genre)}
                onClick={() => toggleGenre(genre)}
                index={i}
              />
            ))}
          </div>
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground self-center mr-1">
                Selected:
              </span>
              {selectedGenres.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="rounded-full text-xs gap-1"
                >
                  {g}
                  <button
                    type="button"
                    className="hover:text-destructive transition-colors"
                    onClick={() => toggleGenre(g)}
                    data-ocid={`create.genre.remove.${g.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Chapters */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <ChapterEditor
            chapters={chapters}
            isPublishing={isPublishing}
            onAdd={addChapterDraft}
            onRemove={removeChapterDraft}
            onChange={updateChapterField}
            onStitchImages={(i) => {
              setStitchTargetChapter(i);
              setStitchModalOpen(true);
            }}
            onThumbnailDrop={handleThumbnailDrop}
            onImageUpload={handleImageUpload}
            onPreview={handlePreviewChapter}
          />
        </div>

        {existingChapters && existingChapters.length > 0 && (
          <div className="flex items-start gap-2 rounded-xl bg-muted/40 border border-border px-4 py-3 text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <span>
              {existingChapters.length} chapter
              {existingChapters.length !== 1 ? "s" : ""} already saved to
              backend. Use unique chapter numbers to avoid duplicates.
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl py-5 text-sm font-semibold gap-2"
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing || !isActorReady}
            data-ocid="create.save_draft_button"
          >
            {isSaving ? (
              <span className="animate-spin w-4 h-4 border-2 border-muted-foreground/40 border-t-foreground rounded-full" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl py-5 text-sm font-semibold gap-2 border-primary/30 text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.preventDefault();
              handlePreviewChapter(0);
            }}
            disabled={isSaving || isPublishing || !isActorReady}
            data-ocid="create.preview_button"
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button
            type="submit"
            className="flex-[2] gradient-primary text-primary-foreground border-0 rounded-2xl py-5 text-base font-semibold shadow-glow gap-2"
            disabled={isSaving || isPublishing || !isActorReady}
            style={{ touchAction: "manipulation" }}
            data-ocid="create.submit_button"
          >
            {isPublishing ? (
              <span className="animate-spin w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {!isActorReady
              ? "Loading..."
              : isPublishing
                ? "Publishing…"
                : existing
                  ? "Publish Changes"
                  : "Publish Comic"}
          </Button>
        </div>
      </form>

      <ImageStitchingModal
        open={stitchModalOpen}
        onClose={() => setStitchModalOpen(false)}
        onImagesUploaded={handleStitchedImages}
        chapterIndex={stitchTargetChapter}
      />

      <PublishConfirmDialog
        open={publishConfirmOpen}
        onConfirm={handlePublishConfirm}
        onCancel={() => !isPublishing && setPublishConfirmOpen(false)}
        isLoading={isPublishing}
        isActorReady={isActorReady}
        progress={uploadProgress}
        error={publishError}
        onDismissError={() => setPublishError(null)}
      />

      {/* Chapter preview modal */}
      <ChapterPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        pages={
          chapters[previewChapterIdx]?.images.map((img) => img.preview) ?? []
        }
        imageOrder={chapters[previewChapterIdx]?.imageOrder ?? []}
        chapterTitle={chapters[previewChapterIdx]?.title ?? ""}
        chapterNumber={chapters[previewChapterIdx]?.chapterNumber ?? 1}
      />

      {/* Publish success modal */}
      {publishSuccessOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
          data-ocid="create.publish_success_dialog"
        >
          <div className="bg-card border border-border rounded-3xl p-7 max-w-sm w-full shadow-lg animate-scale-in text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Upload className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-1">
              Chapter Published! 🎉
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Chapter{" "}
              {chapters.find((ch) => ch.backendId !== null)?.chapterNumber ??
                ""}{" "}
              of <span className="font-semibold text-foreground">{title}</span>{" "}
              is now live and visible to all users.
            </p>
            <div className="flex flex-col gap-3">
              {publishedComicId && publishedChapterId && (
                <Button
                  type="button"
                  className="w-full gradient-primary text-primary-foreground border-0 rounded-xl shadow-glow gap-2"
                  onClick={() => {
                    setPublishSuccessOpen(false);
                    void navigate({
                      to: "/read/$comicId/$chapterId",
                      params: {
                        comicId: publishedComicId,
                        chapterId: publishedChapterId,
                      },
                    });
                  }}
                  data-ocid="create.view_chapter_button"
                >
                  <Eye className="w-4 h-4" /> View Chapter
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => {
                  setPublishSuccessOpen(false);
                  setChapters([
                    {
                      title: `Chapter ${chapters.length + 1}`,
                      images: [],
                      imageOrder: [],
                      orderLocked: false,
                      backendId: null,
                      chapterNumber: chapters.length + 1,
                      status: "draft",
                    },
                  ]);
                }}
                data-ocid="create.upload_next_button"
              >
                <Plus className="w-4 h-4" /> Upload Next Chapter
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-xl text-sm text-muted-foreground"
                onClick={() => {
                  setPublishSuccessOpen(false);
                  void navigate({ to: "/creator-dashboard" });
                }}
                data-ocid="create.go_dashboard_button"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
